import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../core/services/main.service';
import { Router } from '@angular/router';
import { CheckboxModel } from '../../core/models/checkbox.model';
import { TokenModel } from '../../core/models/token.model';
import { UserModel } from '../../core/models/user.model';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { CreateUserModel } from "app/core/models/createUser.model";
import { NgForm, FormControl } from '@angular/forms';

import { SystemAccessGuard } from './../system.guard';


import { Ng2Cable, Broadcaster } from 'ng2-cable';
import { BaseComponent } from 'app/core/base/base.component';


@Component({
  selector: 'app-change-password',
  templateUrl: './changePassword.component.html',
  styleUrls: ['./st-form.css']
})
export class ChangePasswordComponent extends BaseComponent{
    RegistrationErr = false;
    RegErrMsg = '';
    Params = {
      old_password:null,
      password:null,
      confirmation_password:null,
    };

    @ViewChild('submitFormPswrd') form: NgForm;
    
    ChangePassword() {
        if(this.form.valid){
            this.WaitBeforeLoading(
                ()=>this.service.ChangeUserPassword(this.Params),
                (res:any)=>{
                    this.Logout();
                },
                (err)=>{
                    if(err.status == 422){
                        let body:any = JSON.parse(err._body); 
                        this.RegErrMsg = this.service.CheckErrMessage(body);
                        
                    }
                    else {
                        this.RegErrMsg = "Cannot change password! " + err.body;

                    }
                    this.RegistrationErr = true;
                })
            
        }
    } 

}
