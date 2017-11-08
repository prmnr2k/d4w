import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../core/services/main.service';
import { Router } from '@angular/router';
import { CoworkingModel } from '../core/models/coworking.model';
import { CreateCoworkingModel } from '../core/models/createCoworking.model';
import { CheckboxModel } from '../core/models/checkbox.model';
import { WorkingDayModel } from '../core/models/workingDay.model';
import { TokenModel } from '../core/models/token.model';
import { UserModel } from '../core/models/user.model';
import { Base64ImageModel } from '../core/models/base64image.model';
import { NgForm, FormControl } from '@angular/forms';

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
    Days:string[] = [];
    AmetiesCB: CheckboxModel[] = []; 
    Me:UserModel = new UserModel();
    CoworkingId:number = 0;
    meRole:string = 'guest';
    constructor(private service: MainService, private router: Router) { }

    @ViewChild('submitFormCwrc') form: NgForm

    ngOnInit() 
    {
        this.service.GetMe()
            .subscribe((user:UserModel)=>{
                this.Me = user;
                this.service.GetAllCoworking({creator_id:this.Me.id})
                    .subscribe((cwr:CoworkingModel[])=>{
                        console.log(cwr);
                        this.InitByCoworking(cwr[0]);
                        this.service.GetMyAccess()
                        .subscribe((res)=>{
                          this.meRole = res.role;
                          if(res.role!='creator') this.router.navigate(['/all_coworkings']);
                        });
                        this.isLoading = false;
                    })
            })
        
    }

    InitByCoworking(cwrk:CoworkingModel){
        this.Coworking = this.service.CoworkingModelToCreateCoworkingModel(cwrk);
        this.Days = this.service.GetAllDays();
        this.AmetiesCB = this.service.SetCheckedCB(this.service.GetAllAmenties(),this.Coworking.amenties);
        this.CoworkingId = cwrk.id?cwrk.id:0;
        this.Coworking.first_name = this.Me.first_name?this.Me.first_name:'';
        this.Coworking.last_name = this.Me.last_name?this.Me.last_name:'';
        this.Coworking.email = this.Me.email?this.Me.email:'';
        this.Coworking.phone = this.Me.phone?this.Me.phone:'';
        for(let i of cwrk.images){
            this.service.GetImageById(i.id)
                .subscribe((img:Base64ImageModel)=>{
                    this.Coworking.images.push(img.base64);
                })
        }
    }

    DeleteImage(i:number){
        this.Coworking.images.splice(i,1);
    }
    DeleteWorkingDay(i:number){
        this.Coworking.working_days.splice(i,1);
    }

    AddNewWorkingDay(){
        this.Coworking.working_days.push(new WorkingDayModel(this.Days[0]));
    }


    UpdateCoworking(){
        if(this.form.valid){
            this.isLoading = true;
            this.RegistrationErr = false;
            this.Coworking.amenties = this.service.GetValuesOfCheckedCB(this.AmetiesCB);
            if(!this.CheckCwrk()){
                this.RegistrationErr = true;
                this.isLoading = false;
                return;
            }
            this.service.UpdateCoworking(this.CoworkingId,this.Coworking)
                .subscribe((res:CoworkingModel)=>{
                    this.InitByCoworking(res);
                    this.isLoading = false;
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
        }
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
            this.RegErrMsg = "Input working days!";
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

    changeListener($event: any) : void {
        console.log($event);
        this.readThis($event.target);
    }

    readThis(inputValue: any): void {
        for(let i in inputValue.files){
            if(+i < 5){
                let file:File = inputValue.files[i];
                if(!file) break;
                let myReader:FileReader = new FileReader();
                myReader.onloadend = (e) => {
                    this.Coworking.images.push(myReader.result);
                }
                myReader.readAsDataURL(file);
            }
        }
    }

    OnBeginWorkChanged(index:number, $event:any){
        this.Coworking.working_days[index].begin_work = $event;
        if(!this.Coworking.working_days[index].end_work || 
            this.Coworking.working_days[index].end_work < this.Coworking.working_days[index].begin_work)
        {
            let beginArr = this.Coworking.working_days[index].begin_work.split(":");
            let endHour = +beginArr[0] + 2;
            
            this.Coworking.working_days[index].end_work = endHour+ ":" + beginArr[1];
            console.log(this.Coworking.working_days[index].end_work);
        }

    }

}
