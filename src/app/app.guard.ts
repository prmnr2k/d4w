import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Rx";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Injectable } from '@angular/core';
import { UserModel } from './core/models/user.model';
import { MainService } from './core/services/main.service';
import { BaseComponent } from "app/core/base/base.component";

@Injectable()
export class AppAccessGuard extends BaseComponent implements CanActivate{
    
    canActivate(router:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean{

        /*console.log(router);
        console.log(state);*/
        switch(router.routeConfig.path){
            case "login":{
                return this.LoginHandler(router,state);
            }
            default:{
                return true;
            }
        }
    }

    private LoginHandler(router:ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean{

        if(this.isLoggedIn){
            this.router.navigate(['/system','all_coworkings']);
            return false;
        }
        return true;
        
    }
}