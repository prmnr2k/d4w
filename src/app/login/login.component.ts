import { Component, OnInit } from '@angular/core';
import { MainService } from '../core/services/main.service';
import { Router } from '@angular/router';
import { TokenModel } from '../core/models/token.model';
import { BaseComponent } from 'app/core/base/base.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent extends BaseComponent implements OnInit {
    public LoginParams = {
        email:'',
        password: ''
    }

    switchForm: boolean = true;
    isLoginErr = false;
    ngOnInit(): void {
      
    }
    

    TryToLogin(){
        this.isLoginErr = false;
        this.Login(
            this.LoginParams.email,
            this.LoginParams.password,
            (err)=>{
                console.log(err);
                this.isLoginErr = true;
            }  
        );
    }
}