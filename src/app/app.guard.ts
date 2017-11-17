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
        console.log(router);
        console.log(state);
        
        console.log(router.routeConfig.path);
        if(router.routeConfig.path == "login")
            return !this.service.IsLogedIn();
        
        return true;
        

    }
}