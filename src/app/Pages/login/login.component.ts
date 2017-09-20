import { Component,OnInit, Input, Output, EventEmitter}      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { HttpService} from '../../services/http.service';
import {MainService} from "./../../services/main.service";
import { TokenModel } from '../../models/token.model';

@Component({
    moduleId:module.id,
    selector: "login",
    templateUrl: "./login.component.html",
    providers: [HttpService]
})

export class LoginComponent implements OnInit{
    loginData = {
        login:'',
        password:''
    }
    ngOnInit(): void {
    }
    constructor(private router: Router,
        private mainService: MainService){}

    @Output() onLoggedIn: EventEmitter<boolean> = new EventEmitter<boolean>();
    OnLoginButtonClick()
    {
        this.mainService.UserLogin(this.loginData.login,this.loginData.password)
            .subscribe((data:TokenModel)=>{
                this.mainService.BaseInitAfterLogin(data);
                this.router.navigate(['/']);
            },
            (err:any)=>{
                console.log(err);
            }
        );
        
        
    }
}