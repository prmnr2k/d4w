import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../core/services/main.service';
import { Router } from '@angular/router';
import { CheckboxModel } from '../core/models/checkbox.model';
import { TokenModel } from '../core/models/token.model';
import { UserModel } from '../core/models/user.model';
import { Base64ImageModel } from '../core/models/base64image.model';
import { CreateUserModel } from "app/core/models/createUser.model";
import { NgForm, FormControl } from '@angular/forms';
import { PageAccessGuard } from '../page.guard';

import { Ng2Cable, Broadcaster } from 'ng2-cable';


@Component({
  selector: 'app-change-password',
  templateUrl: './changePassword.component.html',
  styleUrls: ['./st-form.css']
})
export class ChangePasswordComponent{
    RegistrationErr = false;
    isLoading = false;
    RegErrMsg = '';
    Params = {
      old_password:null,
      password:null,
      confirmation_password:null,
    };
    constructor(private service: MainService, private router: Router, private ng2cable: Ng2Cable, private broadcaster: Broadcaster) {
        
        this.ng2cable.subscribe('wss://d4w-api.herokuapp.com/cable?token='+service.getToken().token, 'BookingsChannel'); }

    @ViewChild('submitFormPswrd') form: NgForm;
    
    ChangePassword() {
        if(this.form.valid){
            this.isLoading = true;
            console.log('change password');
            this.service.ChangeUserPassword(this.Params)
                .subscribe((res:any)=>{
                    console.log(res);
                    this.service.Logout()
                        .add((logOutRes:any)=>{
                            this.router.navigate(['/login']);
                        });
                },
                (err:any)=>{
                    console.log('Something went wrong!');
                    console.log(err);
                });
        }
    } 

}
