import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MainService } from '../core/services/main.service';
import { Router } from '@angular/router';
import { NgForm, FormControl } from '@angular/forms';

import { CoworkingModel } from '../core/models/coworking.model';
import { CreateCoworkingModel } from '../core/models/createCoworking.model';
import { CheckboxModel } from '../core/models/checkbox.model';
import { WorkingDayModel } from '../core/models/workingDay.model';
import { TokenModel } from '../core/models/token.model';


declare var jquery:any;
declare var $ :any;


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./st-form.css']
})
export class RegistrationComponent implements OnInit {
    RegistrationErr = false;
    isLoading = true;
    RegErrMsg = '';
    Coworking = new CreateCoworkingModel();
    Days:string[] = [];
    AmetiesCB: CheckboxModel[] = [];

    



    constructor(private service: MainService, private router: Router) { }
    ngOnInit() 
    {
        this.Days = this.service.GetAllDays();
        this.AmetiesCB = this.service.GetAllAmenties();
        this.Coworking.images = [];
        this.Coworking.working_days = [new WorkingDayModel(this.Days[0])];
        this.isLoading = false;

        
      

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


    CreateCoworking(){
        if(this.form.valid){

        
            this.isLoading = true;
            this.RegistrationErr = false;
            this.Coworking.amenties = this.service.GetValuesOfCheckedCB(this.AmetiesCB);
            if(!this.CheckCwrk()){
                this.RegistrationErr = true;
                this.isLoading = false;
                
                return;
            }
            console.log(this.Coworking);
            this.service.CreateCoworking(this.Coworking)
                .subscribe((res:CoworkingModel)=>{
                    console.log(res);
                    this.service.UserLogin(this.Coworking.email,this.Coworking.password)
                        .subscribe((res:TokenModel)=>{
                            console.log(res);
                            this.service.BaseInitAfterLogin(res);
                            this.router.navigate(['/']);
                        }
                        ,
                        (err:any)=>{
                            this.RegErrMsg = "Coworking was created but sign in is failed. Try to login yourself!";
                            this.RegistrationErr = true;
                            this.isLoading = false;
                        });
                },
                (err)=>{
                    this.RegErrMsg = "Can`t create coworking: " + err.body;
                    this.RegistrationErr = true;
                    this.isLoading = false;
                })

        }
    }





    @ViewChild('submitFormCwrc') form: NgForm

   


    testSubmitForm(){
        window.scrollTo( 0, 0 );
        console.log(this.form);

        
        
    }















    CheckCwrk(){
        if(!this.Coworking.email || !this.Coworking.price || !this.Coworking.capacity || !this.Coworking.full_name || !this.Coworking.short_name){
            this.RegErrMsg = "Input all fields!";
            return false;
        }
        if(!this.Coworking.password || !this.Coworking.password_confirmation)
        {
            this.RegErrMsg = "Input password and password confirmation!";
            return false;
        }
        if(this.Coworking.password != this.Coworking.password_confirmation)
        {
            this.RegErrMsg = "Passwords are not matched!";
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
            begin = new Date(date.toDateString + " " + i.begin_work);
            end = new Date(date.toDateString + " " + i.end_work);

            if(begin> end){
                return false;
            }
        }


        return true;
    }

    changeListener($event: any) : void {
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
