import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Rx";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Injectable } from '@angular/core';
import { UserModel } from './core/models/user.model';
import { MainService } from './core/services/main.service';

@Injectable()
export class PageAccessGuard implements CanActivate{
    constructor(private service: MainService,private router: Router){
    }
    canActivate(router:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean{
        console.log(router);
        console.log(state);
        
        console.log(router.routeConfig.path);
        if(router.routeConfig.path == "login" || router.routeConfig.path == "registration" || router.routeConfig.path == "userRegistration")
            return !this.service.IsLogedIn();
        else{
             if(this.service.IsLogedIn()){
                 if(router.routeConfig.path==`coworking_profile`){
                        return true;
                 }
                else return true;
            }
            else{
                this.router.navigate(['/login']);
                return false;
            }
        }
        

    }

    LoginPageAccess():boolean{
        let result = this.service.IsLogedIn();
        if(result){
            this.service.GetMe()
                .subscribe((res:UserModel)=>{
                    console.log(res);
                },
            (err:any)=>{
                console.log(err);
            })
        }
            //this.router.navigate(['/']);
        return true;
    }
}