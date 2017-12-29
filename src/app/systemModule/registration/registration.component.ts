import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MainService } from '../../core/services/main.service';
import { Router } from '@angular/router';
import { NgForm, FormControl } from '@angular/forms';

import { CoworkingModel } from '../../core/models/coworking.model';
import { CreateCoworkingModel } from '../../core/models/createCoworking.model';
import { CheckboxModel } from '../../core/models/checkbox.model';
import { WorkingDayModel } from '../../core/models/workingDay.model';
import { TokenModel } from '../../core/models/token.model';
import { FrontWorkingDayModel } from '../../core/models/frontWorkingDays.model';
import { BaseComponent } from 'app/core/base/base.component';
import { ShowHideTrigger } from 'app/shared/animations/showFade.animation';


declare var jquery:any;
declare var $ :any;


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./st-form.css'],
  animations:[
    ShowHideTrigger
  ]
})

export class RegistrationComponent extends BaseComponent implements OnInit  {
    
    RegistrationErr = false;
    
    RegErrMsg = '';
    Coworking = new CreateCoworkingModel();
    Days:FrontWorkingDayModel[] = [];
    AmetiesCB: CheckboxModel[] = [];
    rulesShow:boolean = false;
    flagForImages:boolean = true;
    imagesCount:number = 5;
    Weekends = false;
   
    ngOnInit() 
    {
        this.Days = this.service.GetAllDays();
        this.AmetiesCB = this.service.GetAllAmenties();
        this.Coworking.images = [];
        this.Coworking.working_days = [];
      
        
    }
   
    DeleteImage(i:number){
        this.Coworking.images.splice(i,1);
        this.imagesCount += 1;
        this.flagForImages = true;
    }

    CreateCoworking(){
        if(this.form.valid){
            this.RegistrationErr = false;
            this.Coworking.amenties = this.service.GetValuesOfCheckedCB(this.AmetiesCB);
            this.Coworking.working_days = this.service.GetWorkingDaysFromFront(this.Days);
            if(!this.CheckCwrk()){
                this.RegistrationErr = true;
                this.rulesShow = false;
                return;
            }
            this.WaitBeforeLoading(
                ()=>this.service.checkUserByEmail(this.Coworking.email),
                (res)=>{
                    if(res.exists){
                        this.RegErrMsg = 'Email is existed!';
                        this.RegistrationErr = true;
                    }
                    else{
                        this.rulesShow = true;
                        this.RegistrationErr = false;
                    }
                },
                (err)=>{
                    console.log(err);
                }
            );

        }
    }


    finalCreateCoworking(){
        this.WaitBeforeLoading(
            ()=>this.service.CreateCoworking(this.Coworking),
            (res:CoworkingModel)=>{
                console.log(`ok - finalCreateCoworking`);
                //this.rulesShow = true;
                this.RegistrationErr = false;
                this.rulesShow = false;
                this.Login(
                    this.Coworking.email,
                    this.Coworking.password,
                    (err)=>{
                        if(this.service.GetCurrentLang() == 'en') {
                            this.RegErrMsg = "Coworking was created but sign in is failed. Try to login by yourself!";
                        }
                        else {
                            this.RegErrMsg = "Коворкинг был создан, но возникли проблемы со входом. Попробуйте войти вручную!";
                        }
                        this.rulesShow = false;
                        this.RegistrationErr = true;
                    }
                );
                console.log(`end - finalCreateCoworking`);
            },
            (err)=>{
                if(err.status == 422){
                    let body:any = JSON.parse(err._body); 
                    this.RegErrMsg = this.service.CheckErrMessage(body);
                    
                }
                console.log(err);
                this.rulesShow = false;
                this.RegistrationErr = true;
            }
        );
    }
   
    @ViewChild('submitFormCwrc') form: NgForm

    CheckCwrk(){
        if(!this.Coworking.email || !this.Coworking.price || !this.Coworking.capacity || !this.Coworking.full_name || !this.Coworking.short_name){
            if(this.service.GetCurrentLang() == 'en') {
                this.RegErrMsg = "Input all fields!";
            }
            else {
                this.RegErrMsg = "Введите все поля!";
            }
            return false;
        }
        if(this.Coworking.price < 0){
            if(this.service.GetCurrentLang() == 'en') {
                this.RegErrMsg = "Price cannot be negative!";
            }
            else {
                this.RegErrMsg = "Цена не может иметь отрицательное значение!";
            }
            return false;
        }
        if(this.Coworking.capacity < 0){
            if(this.service.GetCurrentLang() == 'en') {
                this.RegErrMsg = "Capacity cannot be negative!";   
            }
            else {
                this.RegErrMsg = "Количество мест не может быть отрицательным!";

            }
            return false;
        }
        if(!this.Coworking.working_days || this.Coworking.working_days.length == 0 || this.Coworking.working_days.filter(x=> !x.begin_work || !x.end_work).length > 0){
            if(this.service.GetCurrentLang() == 'en') {
                this.RegErrMsg = "Input working days!";
            }
            else {
                this.RegErrMsg = "Введите рабочие дни!";
            }
            return false;
        }
        if(!this.checkWorkingTime()){
            if(this.service.GetCurrentLang() == 'en') {
                this.RegErrMsg = "Input correct working time!";
            }
            else {
                this.RegErrMsg = "Введите верное время работы!";
            }
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
        this.ReadImages(
            $event.target.files,
            (res:string)=>{
                this.Coworking.image = res;
            }
        );
    }

    changeListener($event: any) : void {
        this.readThis($event.target);
    }

    readThis(inputValue: any): void {
        this.ReadImages(
            inputValue.files,
            (res:string)=>{
                if(res && this.Coworking.images.length < 5){
                    this.Coworking.images.push(res);
                }
            }
        );
    }

    changeWeekends($event:any){
        this.Weekends = !this.Weekends;
        if(!this.Weekends){
            for(let i in this.Days){
                if(this.Days[i].weekend){
                    this.Days[i].checked = false;  
                }   
            }
        } 
    }

    MaskTelephone(){
        return {
            mask: ['+','7','(', /[1-9]/, /\d/, /\d/, ')',/\d/, /\d/, /\d/, '-', /\d/, /\d/,'-', /\d/, /\d/],
            keepCharPositions: true
          };
    }

    getMask(index:number){
        return {
            mask: [/[0-2]/, this.Days[index].start_work && parseInt(this.Days[index].start_work[0]) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
            keepCharPositions: true
          };
    } 

    getMaskEnd(index:number){    
        return {
            mask: [/[0-2]/, this.Days[index].finish_work && parseInt(this.Days[index].finish_work[0]) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
            keepCharPositions: true
          };
    } 

    OnBeginWorkChanged(index:number, $event:any){
        this.Days[index].start_work = $event;
        if(!this.Days[index].finish_work || 
            this.Days[index].finish_work < this.Days[index].start_work)
        {
            
            if(this.Days[index].start_work.indexOf("_") == -1){
                if(parseInt(this.Days[index].start_work[0]+this.Days[index].start_work[1]) <= 21 && parseInt(this.Days[index].start_work[3]+this.Days[index].start_work[4])<=59){
                    let beginArr = this.Days[index].start_work.split(":");
                    let endHour;
                    if(+beginArr[0] <= 7){
                        let for_parse = parseInt(beginArr[0][1]);
                         endHour = '0'+(for_parse+2);
                    }
                    else{
                        endHour = +beginArr[0] + 2;
                    }
                    this.Days[index].finish_work = endHour+ ":" + beginArr[1];
                }
                else{
                   
                    this.Days[index].finish_work = "23:59"
                }
            }
        
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

}

