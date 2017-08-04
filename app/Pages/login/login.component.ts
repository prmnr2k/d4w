import { Component,OnInit, Input, Output, EventEmitter}      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpService} from '../../services/http.service';

import {TokenModel} from './../index';
import {MainService} from "./../../services/main.service";

@Component({
    selector: "ads",
    templateUrl: "app/Pages/login/login.component.html",
    providers: [HttpService]
})

export class LoginComponent implements OnInit{
    ngOnInit(): void {
    }
    constructor(private router: Router,
        private mainService: MainService){}

    @Output() onLoggedIn: EventEmitter<boolean> = new EventEmitter<boolean>();
    OnLoginButtonClick(username: string, password:string)
    {
        this.mainService.UserLogin(username,password)
        .add((data:TokenModel)=>{
            
        });
        
    }
}