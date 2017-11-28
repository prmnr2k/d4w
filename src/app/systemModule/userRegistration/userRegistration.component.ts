import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../core/services/main.service';
import { Router } from '@angular/router';
import { CheckboxModel } from '../../core/models/checkbox.model';
import { TokenModel } from '../../core/models/token.model';
import { CreateUserModel } from "app/core/models/createUser.model";
import { UserModel } from "app/core/models/user.model";
import { NgForm, FormControl } from '@angular/forms';
import { BaseComponent } from 'app/core/base/base.component';

@Component({
  selector: 'app-registration',
  templateUrl: './userRegistration.component.html',
  styleUrls: ['./st-form.css']
})
export class UserRegistrationComponent extends BaseComponent implements OnInit {
    RegistrationErr = false;
    RegErrMsg = '';
    User = new CreateUserModel();
   
    @ViewChild('submitFormCwrc') form: NgForm

    ngOnInit(){}

    DeleteImage(i:number){
        this.User.image = null;
    }

    CreateUser(){
        if(this.form.valid){
            this.RegistrationErr = false;
            if(!this.CheckUsr()){
                scroll(1, 1);
                this.RegistrationErr = true;
                return;
            }
            this.WaitBeforeLoading(
                ()=>this.service.CreateUser(this.User),
                (res:UserModel)=>{
                    console.log(res);
                    this.Login(
                        this.User.email,
                        this.User.password,
                        (err)=>{
                            console.log(err);
                            this.RegErrMsg = "You were registered but sign in is failed. Try to login by yourself!";
                            this.RegistrationErr = true;
                        }
                    );
                },
                (err)=>{
                    console.log(err);
                    if(err.status == 422){
                        let body:any = JSON.parse(err._body); 
                        this.RegErrMsg = this.service.CheckErrMessage(body);
                    }
                    else {
                        this.RegErrMsg = "Cannot create profile: " + err.body;
                    }
                    this.RegistrationErr = true;
                }
            );
        }
    }

    CheckUsr(){
        if(!this.User.password || !this.User.password_confirmation)
        {
            this.RegErrMsg = "Input password and password confirmation!";
            return false;
        }
        if(this.User.password != this.User.password_confirmation)
        {
            this.RegErrMsg = "Passwords are not matched!";
            return false;
        }
        if(this.User.password.length < 6)
        {
            this.RegErrMsg = "Password must include more than 6 symbols";
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
                if(res){
                    this.User.image = res;
                }
            }
        );
    }

}
