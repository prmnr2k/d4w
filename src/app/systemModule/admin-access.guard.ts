import { BaseComponent } from 'app/core/base/base.component';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAccessGuard extends BaseComponent implements CanActivate {

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let login = this.service.IsLogedIn();
        switch(next.routeConfig.path){
          case "admin_stat":{
              if(this.service.me.is_admin && login){
                return true;
              }
              else{
                  this.router.navigate(['/system']);
                  return false;
              }
          }
          case "backup":{
              if(this.service.me.is_admin && login){
                return true;
              }
              else{
                  this.router.navigate(['/system']);
                return false;
              }
          }
      }
      return false;
  }
}
