import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Rx";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Injectable } from '@angular/core';
import { UserModel } from './core/models/user.model';
import { MainService } from './core/services/main.service';

@Injectable()
export class AppAccessGuard implements CanActivate{
    constructor(private service: MainService,private router: Router){
    }
    canActivate(router:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean{
        if(router.routeConfig.path == "login"){
            if(this.service.IsLogedIn()){
                this.router.navigate(['system','all_coworkings']);
                return false;
            }
        }
        
        return true;
        

    }
}