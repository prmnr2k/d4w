import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { HttpService } from './core/services/http.service';
import { MainService } from './core/services/main.service';

import { NotificationsComponent } from './systemModule/notifications/notifications.component';
import { Ng2Cable, Broadcaster } from 'ng2-cable';
import { setTimeout } from 'timers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  pushNotification:NotificationsComponent = new NotificationsComponent();
  isLoggedIn:boolean = false;
  title = 'app';
  constructor(private service: MainService,
              private ng2cable: Ng2Cable, private broadcaster: Broadcaster) {
                let notGiveNow = true;
                let prevUser = 0;
                let count = new Date().getTime();
                this.ng2cable.subscribe('wss://d4w-api.herokuapp.com/cable?token='+service.getToken().token, 'BookingsChannel');
                console.log('ng2cable success');
                this.broadcaster.on<JSON>('BookingsChannel').subscribe(
                  message => {
                    if(notGiveNow||(!notGiveNow&&prevUser!=message['booking'].user_id)){
                    notGiveNow = false;
                    count++;
                    prevUser = message['booking'].user_id;
                    console.log(message['event_type']);
                    console.log(message['booking']);
                    
                    if (message['event_type'] == 'created'){
                      let name='';
                      this.service.GetUserById(message['booking'].user_id).
                        subscribe((any)=>{
                          name = any.first_name.slice(0,20);
                         
                         this.pushNotification.showNotification('New booking by '+name+'!','bottom','right');
                        //this.pushNotification.showNotification('User is 10 minutes late!<button type="button" id="id-but" class="form-control" class="btn btn-info btn-fill" (click)="SendSMS()">Send SMS to User</button>','bottom','right',phone);  
                     
                        }); 
                    }

                    else if (message['event_type'] == 'before_start'){
                      let name='';
                      this.service.GetUserById(message['booking'].user_id).
                      subscribe((any)=>{
                        name = any.first_name.slice(0,20);
                        this.pushNotification.showNotification(name+' will come soon!','bottom','right');
                      });
                    }

                    else if (message['event_type'] == 'after_start'){
                      if(!message['booking'].is_visit_confirmed){
                        let phone='',name='';
                        this.service.GetUserById(message['booking'].user_id).
                          subscribe((any)=>{
                            count = new Date().getTime();
                            phone = any.phone;
                            name = any.first_name.slice(0,20);
                          this.pushNotification.showNotification(name+' is 10 minutes late!<button type="button" id="id-but-'+count+'" class="form-control" class="btn btn-info btn-fill">Send SMS to User</button>','bottom','right',phone,count);                   
                        });
                      }
                    }

                    else if (message['event_type'] == 'before_finish'){
                      let name='';
                      this.service.GetUserById(message['booking'].user_id).
                      subscribe((any)=>{
                        name = any.first_name.slice(0,20);
                        this.pushNotification.showNotification(name+' will finish in 5 minutes!','bottom','right');
                      });
                    }

                    else if (message['event_type'] == 'cancel'){
                      let name='';
                      this.service.GetUserById(message['booking'].user_id).
                      subscribe((any)=>{
                        name = any.first_name.slice(0,20);
                        this.pushNotification.showNotification(name+' canceled booking!','bottom','right');
                      });
                    }

                    else if (message['event_type'] == 'extending'){
                      let name='';
                      this.service.GetUserById(message['booking'].user_id).
                      subscribe((any)=>{
                        name = any.first_name.slice(0,20);
                        this.pushNotification.showNotification(name+' add more time to booking!','bottom','right');
                      });
                    }
                    else if (message['event_type'] == 'leaving'){
                      let name='';
                      this.service.GetUserById(message['booking'].user_id).
                      subscribe((any)=>{
                        name = any.first_name.slice(0,20);
                        this.pushNotification.showNotification(name+' want to leave coworking!','bottom','right');
                      });
                    }

                   setTimeout(()=>{notGiveNow = true;prevUser = 0;},1000); 
                  }
                }
                );
              }

  ngOnInit(){
    this.service.onAuthChange$.subscribe(bool => {
      this.isLoggedIn = bool;
      if(this.isLoggedIn)
          this.service.GetMe().subscribe(it =>{
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
  

}
