import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Rx";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Injectable } from '@angular/core';
import { UserModel } from './../core/models/user.model';
import { MainService } from './../core/services/main.service';
import { BaseComponent } from '../core/base/base.component';
import { setTimeout } from "timers";

@Injectable()
export class SystemAccessGuard extends BaseComponent implements CanActivate{
    /*constructor(private service: MainService,private router: Router){
    }*/
    canActivate(router:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean{
        //console.log(router.routeConfig.path);
        let login = this.service.IsLogedIn();
        switch(router.routeConfig.path){
            case "my_bookings":{
                if(this.userStatus == this.UsrEnumStatus.User && login){
                    return false;
                }
                else{
                    return this.LoginNavigate();
                }
            }
            case "change_password":{
                //if(this.userStatus > this.UsrEnumStatus.None && login){
                    if(this.userStatus == this.UsrEnumStatus.Creator && login){
                    return true;
                }
                else{
                    return this.LoginNavigate();
                }
            }
            case "user_profile":{
                //if(this.userStatus > this.UsrEnumStatus.None && login){
                    if(this.userStatus == this.UsrEnumStatus.Creator && login){
                    return true;
                }
                else{
                    return this.LoginNavigate();
                }
            }
            case "table":{
                // console.log(this.userStatus,this.UsrEnumStatus.User,login);
                if(this.userStatus > this.UsrEnumStatus.User && login){
                   // if(this.userStatus == this.UsrEnumStatus.Creator && login){
                    return true;
                }
                else{
                    if(!login)
                        this.LoginNavigate();
                    return false;
                }
            }
            case "coworking_profile":{
                if(this.userStatus == this.UsrEnumStatus.Creator && login){
                    return true;
                }
                else{
                    return this.LoginNavigate();
                }
            }
            case "statistic":{
                if(this.userStatus == this.UsrEnumStatus.Creator && login){
                    return true;
                }
                else{
                    return this.LoginNavigate();
                }
            }
            default:{
                return true;
            }
        }
    }
    
    LoginNavigate(){
        this.router.navigate(['/login']);
        return false;
    }
}