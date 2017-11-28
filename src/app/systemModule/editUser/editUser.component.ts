import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../core/services/main.service';
import { Router } from '@angular/router';
import { CheckboxModel } from '../../core/models/checkbox.model';
import { TokenModel } from '../../core/models/token.model';
import { UserModel } from '../../core/models/user.model';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { CreateUserModel } from "app/core/models/createUser.model";
import { NgForm, FormControl } from '@angular/forms';

import { Ng2Cable, Broadcaster } from 'ng2-cable';
import { BaseComponent } from 'app/core/base/base.component';



@Component({
  selector: 'app-edit-user',
  templateUrl: './editUser.component.html',
  styleUrls: ['./st-form.css']
})
export class EditUserComponent extends BaseComponent implements OnInit {
    RegistrationErr = false;
    isLoading = true;
    RegErrMsg = '';
    User = new CreateUserModel();
    UserId:number = 0;
    meRole:string = 'guest';
    oldEmail:string = '';
   

    @ViewChild('submitFormUsr') form: NgForm;
    
    ngOnInit() 
    {
        this.GetMe(
            ()=>{
                this.InitByUser();
            }
        );
        
    }

    DeleteUser() {
        if(confirm("Are you sure you want to delete your profile?")) {
            this.isLoading = true;
            this.service.DeleteMe()
                .subscribe((res:any)=>{
                    console.log(res);
                    this.service.ClearSession();
                    this.router.navigate(['/login']);
                    
                },
                (err:any)=>{
                    this.isLoading = false;
                    console.log('delete err');
                    console.log(err);
                });
        }
        
    }

    InitByUser(){
       
        this.User = this.service.UserModelToCreateUserModel(this.Me);
        this.oldEmail = this.Me.email?this.Me.email:'';
        this.UserId = this.Me.id?this.Me.id:0;
        this.User.image = this.MyLogo;

    }



    UpdateUser(){
        this.RegistrationErr = false;
        if(this.form.valid){
            if(!this.CheckUsr()){
                this.RegistrationErr = true;
                return;
            }
            if(this.User.email == this.oldEmail){
                this.finalUpdate();
            }
            else{
                this.WaitBeforeLoading(
                    ()=>this.service.checkUserByEmail(this.User.email),
                    (res)=>{
                        if(res.exists){
                            this.RegErrMsg = 'This email is already taken! ';
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
            ()=>this.service.UpdateMe(this.User),
            (res:UserModel)=>{
                this.Me = res;
                this.service.onAuthChange$.next(true);
                this.GetMyImage(
                    ()=>{
                        this.InitByUser();
                    }
                );
            },
            (err)=>{
                if(err.status == 422){
                    let body:any = JSON.parse(err._body); 
                    this.RegErrMsg = this.service.CheckErrMessage(body);
                    
                }
                else {
                    this.RegErrMsg = "Cannot update profile: " + err.body;
                }
                this.RegistrationErr = true;
            }
        );
    }

    CheckUsr(){
        let phoneRegexp = new RegExp('^[+]?[0-9]{3,}$');
        if(this.User.phone && !(phoneRegexp.test(this.User.phone))) {
            this.RegErrMsg = "Invalid phone number!";
            return false;
        }
        return true;
    }

    changeListener($event: any) : void {
        this.readThis($event.target);
    }

    readThis(inputValue: any): void {
        this.ReadImages(
            inputValue.files,
            (res:string)=>{
                this.User.image = res;
            }
        );
    }

}
