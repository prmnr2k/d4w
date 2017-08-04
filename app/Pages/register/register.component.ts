import { Component,OnInit}      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpService} from '../../services/http.service';

import { UserModel, RegisterUserModel } from './../index';
import { CompanyModel, RegisterCompanyModel } from './../index';

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
    RegisterUser(email:string,password:string,fname:string,lname:string,phone:string)
    {
        let user : RegisterUserModel = new RegisterUserModel(email,password,fname,lname,phone);
        console.log(JSON.stringify(user));
        this.mainService.CreateUser(user)
            .then(x=>{
                this.router.navigate(['login']);
            });
    }

    RegisterUserCompany(email:string,password:string,fname:string,lname:string,phone:string,
                        cname:string, caddress:string, coaddress:string, cemail:string, cphone:string, 
                        worktime:string, companyid:string, description:string, links:string, c_type:string, subcategory:string,
                        expertises:string[], agrements:string[])
    {
        let user : RegisterUserModel = new RegisterUserModel(email,password,fname,lname,phone);
        let company : RegisterCompanyModel = new RegisterCompanyModel(cname, caddress, coaddress, cemail, cphone, worktime, companyid, description, links, c_type, subcategory);
        console.log('AAAAAAAAAAAAAA');
        console.log(expertises);
        console.log(JSON.stringify(user));
        this.mainService.CreateUserCompany(user, company, expertises, agrements)
            .then(x=>{
                this.router.navigate(['login']);
            });
    }
}