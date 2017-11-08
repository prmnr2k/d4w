import { Component, OnInit } from '@angular/core';
import { MainService } from '../core/services/main.service';
import { Router } from '@angular/router';
import { CoworkingModel } from '../core/models/coworking.model';
import { CreateCoworkingModel } from '../core/models/createCoworking.model';
import { CheckboxModel } from '../core/models/checkbox.model';
import { WorkingDayModel } from '../core/models/workingDay.model';
import { TokenModel } from '../core/models/token.model';
import { UserModel } from '../core/models/user.model';
import { Base64ImageModel } from '../core/models/base64image.model';

@Component({
  selector: 'app-edit-coworking',
  templateUrl: './editCoworking.component.html'
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
    constructor(private service: MainService, private router: Router) { }

    ngOnInit() 
    {
        this.service.GetMe()
            .subscribe((user:UserModel)=>{
                this.Me = user;
                this.service.GetAllCoworking({creator_id:this.Me.id})
                    .subscribe((cwr:CoworkingModel[])=>{
                        console.log(cwr);
                        this.InitByCoworking(cwr[0]);
                        
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
                this.RegErrMsg = "Cant update coworking: " + err.body;
                this.RegistrationErr = true;
                this.isLoading = false;
            });
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
        
        
        return true;
    }

    changeListener($event: any) : void {
        console.log($event);
        this.readThis($event.target);
    }

    readThis(inputValue: any): void {
        for(let f of inputValue.files){
            let file:File = f;
            if(!file) return;
            let myReader:FileReader = new FileReader();
            myReader.onloadend = (e) => {
                    this.Coworking.images.push(myReader.result);
            }
            myReader.readAsDataURL(file);
        }
    }

}
