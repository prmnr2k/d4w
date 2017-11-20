import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from './../../core/services/main.service';
import { Router } from '@angular/router';
import { CoworkingModel } from './../../core/models/coworking.model';
import { CreateCoworkingModel } from './../../core/models/createCoworking.model';
import { WorkerRequestModel } from './../../core/models/workerRequest.model';
import { CheckboxModel } from './../../core/models/checkbox.model';
import { WorkingDayModel } from './../../core/models/workingDay.model';
import { NgForm, FormControl } from '@angular/forms';
import { TokenModel } from '../../core/models/token.model';
import { FrontWorkingDayModel } from '../../core/models/frontWorkingDays.model';
import { Base64ImageModel } from '../../core/models/base64image.model';

import { Ng2Cable, Broadcaster } from 'ng2-cable';
import { UserModel } from 'app/core/models/user.model';



@Component({
  selector: 'app-edit-coworking',
  templateUrl: './editCoworking.component.html',
  styleUrls: ['./st-form.css']
})
export class EditCoworkingComponent implements OnInit {
    RegistrationErr = false;
    isLoading = true;
    RegErrMsg = '';
    Coworking = new CreateCoworkingModel();
    Days:FrontWorkingDayModel[] = [];
    AmetiesCB: CheckboxModel[] = []; 
    Me:UserModel = new UserModel();
    CoworkingId:number = 0;
    meRole:string = 'guest';
    coworkingWorkers:UserModel[] = [];
    coworkingWorkersRequest:WorkerRequestModel[] = [];
    coworkingWorkersRequestUser:UserModel[] = [];
    oldEmail:string = "";
    flagForImages:boolean = true;
    imagesCount:number = 5;
    arrorTime:string = '';
    constructor(private service: MainService, private router: Router, private ng2cable: Ng2Cable, private broadcaster: Broadcaster) {
        
        this.ng2cable.subscribe('wss://d4w-api.herokuapp.com/cable?token='+service.getToken().token, 'BookingsChannel'); 
    }

    @ViewChild('submitFormCwrc') form: NgForm;

    ngOnInit() 
    {
        this.service.GetMe()
            .subscribe((user:UserModel)=>{
                this.Me = user;
                this.service.GetAllCoworking({creator_id:this.Me.id})
                    .subscribe((cwr:CoworkingModel[])=>{
                        this.CoworkingId = cwr[0].id;
                        console.log(cwr);
                        this.imagesCount = 5 - cwr[0].images.length;
                        this.InitByCoworking(cwr[0]);
                        this.service.GetMyAccess()
                        .subscribe((res)=>{
                          this.meRole = res.role;
                          if(res.role!='creator') this.router.navigate(['/all_coworkings']);
                        });

                        this.service.GetCoworkingWorkersRequest(this.CoworkingId)
                        .subscribe((res:WorkerRequestModel[])=>{
                            console.log(`request worker`,res);
                            this.coworkingWorkersRequest = res;
                            let count = 0;
                            for(let i of res){
                                console.log('get user by id',i.user_id);
                                this.service.GetUserById(i.user_id)
                                .subscribe((user:UserModel)=>{
                                    console.log('user = ',user);
                                    this.coworkingWorkersRequest[count].user_name = user.first_name;
                                    this.coworkingWorkersRequest[count].user_email = user.email;
                                    count++;
                                });
                            
                            }
                        });

                        this.service.GetCoworkingWorkers(this.CoworkingId)
                        .subscribe((res:UserModel[])=>{
                            console.log(`avalieble worker`,res);
                            this.coworkingWorkers = res;
                        });

                        this.isLoading = false;
                    })
            });

            
        
    }

    InitByCoworking(cwrk:CoworkingModel){
        this.Coworking = this.service.CoworkingModelToCreateCoworkingModel(cwrk);
        this.Days = this.service.GetAllDays();
        this.AmetiesCB = this.service.SetCheckedCB(this.service.GetAllAmenties(),this.Coworking.amenties);
        this.CoworkingId = cwrk.id?cwrk.id:0;
        this.Coworking.first_name = this.Me.first_name?this.Me.first_name:'';
        this.Coworking.last_name = this.Me.last_name?this.Me.last_name:'';
        this.Coworking.email = this.oldEmail = this.Me.email?this.Me.email:'';
        this.Coworking.phone = this.Me.phone?this.Me.phone:'';
        this.Days = this.service.GetFrontDaysByWorkingDays(cwrk.working_days);
        let imgId = cwrk.image_id?cwrk.image_id:(this.Me.image_id?this.Me.image_id:0);
        if(imgId){
            this.service.GetImageById(imgId)
                .subscribe((res:Base64ImageModel)=>{
                    this.Coworking.image = res.base64;
                })
        }
        for(let i of cwrk.images){
            this.service.GetImageById(i.id)
                .subscribe((img:Base64ImageModel)=>{
                    this.Coworking.images.push(img.base64);
                })
        }
    }

    DeleteImage(i:number){
        this.Coworking.images.splice(i,1);
        this.imagesCount += 1;
        this.flagForImages = true;
    }
    /*DeleteWorkingDay(i:number){
        this.Coworking.working_days.splice(i,1);
    }

    AddNewWorkingDay(){
        this.Coworking.working_days.push(new WorkingDayModel(this.Days[0]));
    }*/


    UpdateCoworking(){
        if(this.form.valid){
            this.isLoading = true;
            this.RegistrationErr = false;
            this.Coworking.amenties = this.service.GetValuesOfCheckedCB(this.AmetiesCB);
            this.Coworking.working_days = this.service.GetWorkingDaysFromFront(this.Days);
            if(!this.CheckCwrk()){
                this.RegistrationErr = true;
                this.isLoading = false;
                return;
            }
            if(this.Coworking.email == this.oldEmail) {
                this.finalUpdate();
            }
            else {
                this.service.checkUserByEmail(this.Coworking.email).subscribe((ressponjo:any)=>{
                    if(ressponjo.exists){
                        console.log("susestv");
                        this.RegErrMsg = 'This email is already taken! ';
                        this.RegistrationErr = true;
                        this.isLoading = false;
                    }
                    else{
                        this.finalUpdate();
                    }
                });
            }
        }
    }

    finalUpdate() {
        this.service.UpdateCoworking(this.CoworkingId,this.Coworking)
        .subscribe((res:CoworkingModel)=>{
            this.service.GetMe()
                .subscribe((usr:UserModel)=>{
                    this.Me = usr;
                    this.InitByCoworking(res);
                })
            
            this.isLoading = false;
            this.service.onAuthChange$.next(true);
        },
        (err:any)=>{
            if(err.status == 422){
                let body:any = JSON.parse(err._body); 
                this.RegErrMsg = this.service.CheckErrMessage(body);
                
            }
            else {
                this.RegErrMsg = "Can`t update coworking: " + err.body;
            }
            this.RegistrationErr = true;
            this.isLoading = false;
        });
    this.isLoading = false;
    this.RegistrationErr = false;
    }

    CheckCwrk(){
        if(!this.Coworking.email || !this.Coworking.price || !this.Coworking.capacity || !this.Coworking.full_name || !this.Coworking.short_name){
            this.RegErrMsg = "Input all fields!";
            return false;
        }
        if(this.Coworking.price < 0){
            this.RegErrMsg = "Input positive value for price!";
            return false;
        }
        if(this.Coworking.capacity < 0){
            this.RegErrMsg = "Input positive value for capacity!";
            return false;
        }
        if(!this.Coworking.working_days || this.Coworking.working_days.length == 0 || this.Coworking.working_days.filter(x=> !x.begin_work || !x.end_work).length > 0){
            
            this.arrorTime = "Input working days!";

            return false;
        }
        if(!this.checkWorkingTime()){
            this.RegErrMsg = "Input correct working time!";
            return false;
        }
        
        return true;
    }

    checkWorkingTime(){
        let date = new Date();
        let begin:Date,end:Date;
        for(let i of this.Coworking.working_days){
            let beginArr = i.begin_work.split(":");
            let endArr = i.end_work.split(":");
            begin = new Date(date.setHours(+beginArr[0],+beginArr[1]));
            end = new Date(date.setHours(+endArr[0],+endArr[1]));
            if( begin > end ){
                return false;
            }
        }
        return true;
    }

    loadLogo($event:any):void{
        let target = $event.target;
        let file:File = target.files[0];
        if(!file)
            return;
        let reader:FileReader = new FileReader();
        reader.onload = (e) =>{
            this.Coworking.image = reader.result;
        }
        reader.readAsDataURL(file);
    }

    changeListener($event: any) : void {
        this.readThis($event.target);
    }



    readThis(inputValue: any): void {

        for(let i in inputValue.files){
            if(+i <= 5){
                this.imagesCount -= 1;
                console.log(this.imagesCount);
                if(this.imagesCount >= 0){
                   
                    let file:File = inputValue.files[i];
                    if(!file) break;
                    let myReader:FileReader = new FileReader();
                    myReader.onloadend = (e) => {
                        this.Coworking.images.push(myReader.result);
                    }
                    
                    myReader.readAsDataURL(file);
                }
                else{
                    this.imagesCount = 0;
                    this.flagForImages = false;
                }
                if(this.imagesCount == 0){
                    this.flagForImages = false;
                }

            }
            
        }
    }
    OnBeginWorkChanged(index:number, $event:any){
        this.Days[index].start_work = $event;
        if(!this.Days[index].finish_work || 
            this.Days[index].finish_work < this.Days[index].start_work)
        {
            let beginArr = this.Days[index].start_work.split(":");
            let endHour = +beginArr[0] + 2;
            
            this.Days[index].finish_work = endHour+ ":" + beginArr[1];
        
        }

    }

    SetWorkNonStop(i,$event){
            this.Days[i].nonstop = $event;
            if(this.Days[i].nonstop){
                this.Days[i].checked = true;
                this.Days[i].start_work = "00:00";
                this.Days[i].finish_work = "23:59";
            }
    }

    AddWorker(id:number){
        this.service.RequestAccess(id)
        .subscribe((any)=>{
            console.log(any,`add success!`);
            location.reload();
        });
        
    }

    DeleteWorker(id:number){
        console.log(`remove_id = `,id);
        this.service.RemoveAccess(id)
        .subscribe((any)=>{
            console.log(any,`delete success!`);
            location.reload();
        });
        
    }
    DeleteRequestWorker(id:number){
        this.service.RemoveAccessRequest(id)
        .subscribe((any)=>{
            console.log(any,`delete request success!`);
            location.reload();
        })
    }

    AddWorkerEmail(email:string){
        console.log(`add by email`,email);
        this.service.RequestAccessEmail(this.CoworkingId,email)
        .subscribe((any)=>{
            console.log(any,`email add`);
            location.reload();
        });
    }

}
