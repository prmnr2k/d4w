import { Component,OnInit}      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpService} from '../../services/http.service';

import { UserModel} from './../index';

import {MainService} from "./../../services/main.service";

@Component({
    selector: "ads",
    templateUrl: "app/Pages/register/register.component.html",
    providers: [HttpService]
})

export class RegisterComponent implements OnInit{
    ngOnInit(): void {
    }
    constructor(private router: Router,
        private mainService: MainService){}
    RegisterPro(gender:string,bd:Date,email:string,full_name:string,phone:string,password:string,description:string)
    {
        this.mainService.CreateUser('pro',gender,bd,"./production/images/man.jpg","source/images/userspace.png",null,full_name,email,phone,null,description,password)
        .then(result=>{
            console.log(JSON.parse(localStorage.getItem('UserList')));
            this.router.navigate(["login"]);
        });
    }

    RegisterClient(gender:string,bd:Date,email:string,full_name:string,phone:string,password:string)
    {
        this.mainService.CreateUser('client',gender,bd,"./production/images/man.jpg",null,null,full_name,email,phone,null,null,password)
        .then(result=>{
            this.router.navigate(["login"]);
        });
    }
}