import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { HttpService } from './core/services/http.service';
import { MainService } from './core/services/main.service';

import { NotificationsComponent } from '../app/notifications/notifications.component';
import { Ng2Cable, Broadcaster } from 'ng2-cable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  pushNotification:NotificationsComponent = new NotificationsComponent();
  isLoggedIn:boolean = false;
  title = 'app';
  constructor(public location: Location, private service: MainService,
              private ng2cable: Ng2Cable, private broadcaster: Broadcaster) {
               
                  this.ng2cable.subscribe('wss://d4w-api.herokuapp.com/cable?token=kek', 'NotificationsChannel');
                  console.log("subscribed");
                  this.broadcaster.on<string>('NotificationsChannel').subscribe(
                    message => {
                      console.log('asasasasa');
                      console.log(message + ' DAROVA');
                    }
                  );
              }

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

      if(status=='creator'||status=='receptionist'){
      let timerId = setInterval (() => {

        if(!this.isLoggedIn) clearInterval(timerId);
        console.log("Show notif");

        this.service.AsyncPost()
        .subscribe((res)=>{
          console.log(`res async post:`,res);
        });

        this.pushNotification.showNotification('status = '+status+' id: '+id,'bottom','right');
        
      }, 8000);
    }
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
