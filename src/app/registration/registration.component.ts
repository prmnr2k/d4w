import { Component, OnInit } from '@angular/core';
import { MainService } from '../core/services/main.service';
import { Router } from '@angular/router';
import { CoworkingModel } from '../core/models/coworking.model';
import { CreateCoworkingModel } from '../core/models/createCoworking.model';
import { CheckboxModel } from '../core/models/checkbox.model';
import { WorkingDayModel } from '../core/models/workingDay.model';
import { TokenModel } from '../core/models/token.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent implements OnInit {
    isLoginErr = false;
    isLoading = true;
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
        this.Coworking.amenties = this.service.GetValuesOfCheckedCB(this.AmetiesCB);
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
                        this.isLoginErr = true;
                        this.isLoading = false;
                    });
            })
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
