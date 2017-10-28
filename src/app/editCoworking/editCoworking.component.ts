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
    isLoginErr = false;
    isLoading = true;
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
                        console.log(cwr[0]);
                        this.Coworking = this.service.CoworkingModelToCreateCoworkingModel(cwr[0]);
                        this.Days = this.service.GetAllDays();
                        this.AmetiesCB = this.service.SetCheckedCB(this.service.GetAllAmenties(),this.Coworking.amenties);
                        this.CoworkingId = cwr[0].id;
                        this.Coworking.first_name = this.Me.first_name;
                        this.Coworking.last_name = this.Me.last_name;
                        this.Coworking.email = this.Me.email;
                        this.Coworking.phone = this.Me.phone;
                        for(let i of cwr[0].images){
                            this.service.GetImageById(i.id)
                                .subscribe((img:Base64ImageModel)=>{
                                    this.Coworking.images.push(img.base64);
                                })
                        }
                    })
            })
        
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
        this.Coworking.amenties = this.service.GetValuesOfCheckedCB(this.AmetiesCB);
        console.log(this.Coworking);
        this.service.UpdateCoworking(this.CoworkingId,this.Coworking)
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
