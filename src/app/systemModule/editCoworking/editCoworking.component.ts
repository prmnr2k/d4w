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
import { BaseComponent } from '../../core/base/base.component';
import { ShowHideTrigger } from 'app/shared/animations/showFade.animation';



@Component({
  selector: 'app-edit-coworking',
  templateUrl: './editCoworking.component.html',
  styleUrls: ['./st-form.css'],
  animations:[
    ShowHideTrigger
  ]
})
export class EditCoworkingComponent extends BaseComponent implements OnInit {
    RegistrationErr = false;
   
    RegErrMsg = '';
    Coworking = new CreateCoworkingModel();
    Days:FrontWorkingDayModel[] = [];
    AmetiesCB: CheckboxModel[] = []; 
    Me:UserModel = new UserModel();
    CoworkingId:number = 0;
    
    coworkingWorkers:UserModel[] = [];
    coworkingWorkersRequest:WorkerRequestModel[] = [];
    coworkingWorkersRequestUser:UserModel[] = [];
    oldEmail:string = "";
    flagForImages:boolean = true;
    imagesCount:number = 5;
    arrorTime:string = '';
    @ViewChild('submitFormCwrc') form: NgForm;


    ngOnInit() 
    {
       this.BaseInit();
    }
    GetUsersByRequests(){
        for(let i in this.coworkingWorkersRequest){
            this.WaitBeforeLoading(
                ()=> this.service.GetUserById(this.coworkingWorkersRequest[i].user_id),
                (res:UserModel)=>{
                    this.coworkingWorkersRequest[i].user_name = res.first_name;
                    this.coworkingWorkersRequest[i].user_email = res.email;
                },
                (err)=>{
                    console.log(err);
                }
            );

        }
    }

    GetCoworkingWorkers(){
        this.WaitBeforeLoading(
            ()=>this.service.GetCoworkingWorkers(this.CoworkingId),
            (res:UserModel[])=>{
                this.coworkingWorkers = res;
                
            },
            (err)=>{
                console.log(err);
            }

        );
    }

    GetWorkersRequest(){
        this.WaitBeforeLoading(
            ()=> this.service.GetCoworkingWorkersRequest(this.CoworkingId),
            (res:WorkerRequestModel[])=>{
                this.coworkingWorkersRequest = res;
                this.GetUsersByRequests();
            },
            (err)=>{
                console.log(err);
            }
        );
    }

    BaseInit(){
        this.GetMe(
            ()=>{
                this.GetMyCoworking();
            }
        );
    }

    GetMyCoworking(){
        this.WaitBeforeLoading(
            ()=> this.service.GetAllCoworking({creator_id:this.Me.id}),
            (res:CoworkingModel[])=>{
                this.CoworkingId = res[0].id;
                this.imagesCount = 5 - res[0].images.length;
                this.InitByCoworking(res[0]);
                this.GetWorkersRequest();
                this.GetCoworkingWorkers();
            },
            (err)=>{
                console.log(err);
            }
        );
    }

    InitByCoworking(cwrk:CoworkingModel){
        this.Coworking = this.service.CoworkingModelToCreateCoworkingModel(cwrk);
        this.InitByMyself();
        this.CoworkingId = cwrk.id?cwrk.id:0;

        this.AmetiesCB = this.service.SetCheckedCB(this.service.GetAllAmenties(),this.Coworking.amenties);
        this.Days = this.service.GetFrontDaysByWorkingDays(cwrk.working_days);
        
        let imgId = cwrk.image_id?cwrk.image_id:(this.Me.image_id?this.Me.image_id:0);
        this.GetImageById(
            imgId,
            (res:Base64ImageModel)=>{
                this.Coworking.image = res.base64;
            }
        );
        for(let i of cwrk.images){
            this.GetImageById(
                i.id,
                (res:Base64ImageModel)=>{
                    this.Coworking.images.push(res.base64);
                }
            );
        }
    }

   

    InitByMyself(){
        this.Coworking.first_name = this.Me.first_name?this.Me.first_name:'';
        this.Coworking.last_name = this.Me.last_name?this.Me.last_name:'';
        this.Coworking.email = this.oldEmail = this.Me.email?this.Me.email:'';
        this.Coworking.phone = this.Me.phone?this.Me.phone:'';
    }

    DeleteImage(i:number){
        this.Coworking.images.splice(i,1);
        this.imagesCount += 1;
        this.flagForImages = true;
    }
   


    UpdateCoworking(){
        if(this.form.valid){
            this.RegistrationErr = false;
            this.Coworking.amenties = this.service.GetValuesOfCheckedCB(this.AmetiesCB);
            this.Coworking.working_days = this.service.GetWorkingDaysFromFront(this.Days);
            if(!this.CheckCwrk()){
                this.RegistrationErr = true;
                
                return;
            }
            if(this.Coworking.email == this.oldEmail) {
                this.finalUpdate();
            }
            else {
                this.WaitBeforeLoading(
                    ()=> this.service.checkUserByEmail(this.Coworking.email),
                    (res:any)=>{
                        if(res.exists){
                            this.RegErrMsg = this.service.CheckErrMessage(res);
                            this.RegistrationErr = true;
                        }
                        else{
                            this.finalUpdate();
                        }
                    },
                    (err)=>{
                        console.log(err);
                    }
                );
            }
        }
    }
    finalUpdate() {
        this.WaitBeforeLoading(
            ()=> this.service.UpdateCoworking(this.CoworkingId,this.Coworking),
            (res:CoworkingModel)=>{
                this.GetMe(
                    ()=>{
                        this.InitByCoworking(res);
                        this.service.onAuthChange$.next(true);
                    }
                );
            },
            (err)=>{
                if(err.status == 422){
                    let body:any = JSON.parse(err._body); 
                    this.RegErrMsg = this.service.CheckErrMessage(body);
                }
                this.RegistrationErr = true;
            }
        );
    }

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
                this.arrorTime = "Input working days!";
            }
            else {
                this.arrorTime = "Введите рабочие дни!";
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

    AddWorker(id:number){
        this.service.RequestAccess(id)
        .subscribe((any)=>{
            this.GetWorkersRequest();
            this.GetCoworkingWorkers();
        });
    }

    DeleteWorker(id:number){
   
        this.service.RemoveAccess(id)
        .subscribe((any)=>{
            this.GetCoworkingWorkers();
        });
    }
    DeleteRequestWorker(id:number){
        this.service.RemoveAccessRequest(id)
        .subscribe((any)=>{
            this.GetWorkersRequest();
        })
    }

    AddWorkerEmail(email:string){
        this.service.RequestAccessEmail(this.CoworkingId,email)
        .subscribe((any)=>{
            this.GetCoworkingWorkers();
        });
    }

}
