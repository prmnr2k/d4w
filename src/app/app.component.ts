import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { HttpService } from './core/services/http.service';
import { MainService } from './core/services/main.service';

import { NotificationsComponent } from '../app/notifications/notifications.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  pushNot:NotificationsComponent = new NotificationsComponent();
  isLoggedIn:boolean = false;
  constructor(public location: Location, private service: MainService) {}

  ngOnInit(){
    this.service.onAuthChange$.subscribe(bool => {
      this.isLoggedIn = bool;
      if(this.isLoggedIn)
          this.service.GetMe().subscribe(it =>{
              console.log(it);
            }
          );
    });

    this.service.TryToLoginWithToken();

    this.service.GetMyAccess().
    subscribe((any)=>{

      let status = any.role;
      let id = any.coworking_id;

      if(status=='creator'||status=='receptionist')
      setInterval (() => {
        console.log("Show notif");
        this.pushNot.showNotification('status = '+status+' id: '+id,'bottom','right');
      }, 10000);
    });
   
    
  }

  

  isMap(path){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice( 1 );
    if(path == titlee){
      return false;
    }
    else {
      return true;
    }
  }
}
