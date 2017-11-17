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
                
                this.ng2cable.subscribe('wss://d4w-api.herokuapp.com/cable?token='+service.getToken().token, 'BookingsChannel');
                console.log('ng2cable success');
                this.broadcaster.on<JSON>('BookingsChannel').subscribe(
                  message => {
                    console.log(message['event_type']);
                    console.log(message['booking']);
                    if (message['event_type'] == 'created'){
                      let name='';
                      this.service.GetUserById(message['booking'].user_id).
                      subscribe((any)=>{
                        name = any.first_name;
                        this.pushNotification.showNotification('New booking by '+name+'!','bottom','right');
                      });
                      
                  }else if (message['event_type'] == 'before_start'){
                      this.pushNotification.showNotification('Booking start after 15 min!','bottom','right');
                  }
                  else if (message['event_type'] == 'after_start'){
                    if(!message['booking'].is_visit_confirmed)
                      this.pushNotification.showNotification('Booking started 10 min ago!<button type="button" id="id-but" class="form-control" class="btn btn-info btn-fill" (click)="SendSMS()">Send SMS to User</button>','bottom','right',message['booking'].user_id);
                  }
                  else if (message['event_type'] == 'before_finish'){
                      this.pushNotification.showNotification('Booking finish after 5 min!','bottom','right');
                  }
                    
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
/*
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
 
  */ 
   
  }

  SendSMS(){
    console.log(`send sms`);
    this.service.SendSmsClickatell('380669643799','smsFrom SnollyPc');
    
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
