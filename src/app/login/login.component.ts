import { Component, OnInit } from '@angular/core';
import { MainService } from '../core/services/main.service';
import { Router } from '@angular/router';
import { TokenModel } from '../core/models/token.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    public LoginParams = {
        email:'',
        password: ''
    }
    constructor(private service: MainService, private router: Router) { }
    isLoginErr = false;
    isLoading = true;
    ngOnInit(): void {
        this.isLoading = false;
    }

    TryToLogin(){
        this.isLoginErr = false;
        this.isLoading = true;
        this.service.UserLogin(this.LoginParams.email,this.LoginParams.password)
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
    }
}