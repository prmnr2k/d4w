
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Rx";
import {MainService} from "./../services/main.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Injectable } from '@angular/core';

@Injectable()
export class PageAccessGuard implements CanActivate{
    constructor(private service: MainService,private router: Router){}
    canActivate(route:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean{
        if(!this.service.httpService.headers.has('Authorization')){
            this.router.navigate(["401"]);
            return false;
        }
        return true;

    }
}