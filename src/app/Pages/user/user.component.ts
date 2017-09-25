import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RouterModule } from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
import { UserModel } from '../../models/user.model';
import { Base64ImageModel } from '../../models/base64image.model';
import { CreateUserModel } from '../../models/createUser.model';
import { ActivityModel } from '../../models/activity.model';
import { MessageModel } from '../../models/message.model';
import { BookingModel } from '../../models/booking.model';

@Component({
    moduleId:module.id,
    selector: "user",
    templateUrl: "./user.component.html",
    providers: [HttpService]
})

export class UserComponent implements OnInit{
    isLoading = true;
    User:UserModel = new UserModel();
    isMe = false;
    Logo:string = "./app/images/man.jpg";
    Background:string = "./app/images/hero-back.png";
    Diploma:string = '';
    MenuItem = "bookings";
    ProfileMenu = "profile";
    MessagesMenu = "received";
    Activities:ActivityModel[]=[];
    ActImages:string[] = [];
    UserUpdate:CreateUserModel = new CreateUserModel();
    Messages:MessageModel[] = [];
    Users:UserModel[] = [];
    MessLoading = true;
    Message:MessageModel = new MessageModel();
    CurrentMessage:MessageModel = new MessageModel();
    MessOk = false;
    MessErr = false;
    BookingLoading = true;
    BookingsMenu = "future";
    Bookings:BookingModel[] = [];
    BookingsActivities: ActivityModel[] = [];
    constructor(private router: Router,
        private service: MainService,
        private activatedRoute: ActivatedRoute){}

    ngOnInit(){
        this.activatedRoute.params.forEach((params:Params) => {
            this.isLoading = true;
            let userId = params["id"];
            //TODO: REWRITE THIS HARDCODE
            if(userId == 'me' || userId == this.service.me.id){
                this.isMe = true;
                this.service.GetMe()
                    .subscribe((res:UserModel)=>{
                        this.AfterGettingUser(res);
                    },
                    (err:any)=>{
                        console.log(err);
                    });
            }
            else{
               this.service.GetUserById(userId)
                .subscribe((user:UserModel)=>{
                    this.AfterGettingUser(user);
                });
            }
        });
    }

    SetMenuItem(item:string){
        this.MenuItem = item;
    }

    AfterGettingUser(user:UserModel){
        this.User = user;
        if(this.isMe)
            this.UserUpdate = this.service.UserModelToCreateUserModel(this.User);
        if(this.User.image_id){
            this.service.GetImageById(this.User.image_id)
                .subscribe((logo:Base64ImageModel)=>{
                    this.Logo = logo.base64;
                    if(this.isMe)
                        this.UserUpdate.image = logo.base64;
                });
        }
        if(this.User.background_id){
            this.service.GetImageById(this.User.background_id)
                .subscribe((bg:Base64ImageModel)=>{
                    this.Background = bg.base64;
                    if(this.isMe)
                        this.UserUpdate.background = bg.base64;
                });
        }
        if(this.User.diploma_id){
            this.service.GetImageById(this.User.diploma_id)
                .subscribe((diploma:Base64ImageModel)=>{
                    this.Diploma = diploma.base64;
                    if(this.isMe)
                        this.UserUpdate.diploma = diploma.base64;
                });
        }
        
        this.GetActivityies();
        this.MessagesTypeChanged(this.MessagesMenu);
        this.BookingsTypeChanged(this.BookingsMenu);
        this.isLoading = false;
    }
    GetActivityies(){
        this.service.GetAllActivities({user_id:this.User.id})
        .subscribe((res:ActivityModel[])=>{
            this.Activities = res;
            for(let item of this.Activities){
                if(item.image_id){
                    this.service.GetImageById(item.image_id)
                        .subscribe((res:Base64ImageModel)=>{
                            this.ActImages[item.id]=res.base64;
                        })
                }
            }
        })
    }

    ChangePw(old_password:string,new_password:string){
        this.service.ChangePassword(old_password,new_password)
            .subscribe((res:UserModel)=>{
                console.log(res);
                this.AfterGettingUser(res);
            },
            (err:any)=>{
                console.log(err);
            })
    }

    UpdateUser(){
        this.service.UpdateUser(this.User.id,this.UserUpdate)
            .subscribe((res:UserModel)=>{
                console.log(res);
                this.AfterGettingUser(res);
            })
            
    }

    changeListener(field:string,$event: any) : void {
        this.readThis(field,$event.target);
    }

    readThis(field:string,inputValue: any): void {
        let file:File = inputValue.files[0];
        if(!file) return;
        let myReader:FileReader = new FileReader();
        myReader.onloadend = (e) => {
            if(field == 'user_logo'){
                this.UserUpdate.image = myReader.result;
            }
            else if(field == 'diploma')
            {
                this.UserUpdate.diploma = myReader.result;
            }
            else {
                this.UserUpdate.background = myReader.result;
            }
        }
        myReader.readAsDataURL(file);
    }

    OnDeleteAct(item:ActivityModel){
        this.service.DeleteActivity(item.id)
            .subscribe(()=>{
                this.GetActivityies();
            })
    }

    OnEditAct(item:ActivityModel){
        this.router.navigate(['/edit_act',item.id]);
    }

    BookingsTypeChanged($event){
        this.BookingLoading = true;
        this.BookingsMenu = $event;
        if(this.BookingsMenu == "future"){
            this.GetFutureBookings();
        }
        else{
            this.GetPastBookings();
        }
    }

    GetFutureBookings(){
        this.service.GetFutureBookings()
            .subscribe((res:BookingModel[])=>{
                this.Bookings = res;
                this.GetActivitiesByBookings();
            })
    }

    GetPastBookings(){
        this.service.GetPastBookings()
            .subscribe((res:BookingModel[])=>{
                this.Bookings = res;
                this.GetActivitiesByBookings();
            })
    }

    GetActivitiesByBookings(){
        let total = this.Bookings.length;
        let current = 0;
        for(let item of this.Bookings){
            this.service.GetActivity(item.activity_id)
                .subscribe((res:ActivityModel)=>{
                    this.BookingsActivities[res.id] = res;
                    current += 1;
                    if(current == total)
                        this.BookingLoading = false;
                })
        }
        
    }

    MessagesTypeChanged($event){
        this.MessagesMenu = $event;
        if(this.MessagesMenu == "received")
            this.GetRecievedMessages();
        else this.GetSentMessages();
    }
    GetRecievedMessages(){
        this.MessLoading = true;
        this.service.GetReceivedMessages("")
            .subscribe((res:MessageModel[])=>{
                this.Messages = res;
                this.GetUsersByMessages();
                this.MessLoading = false;
            })
    }
    GetSentMessages(){
        this.MessLoading = true;
        this.service.GetSentMessages("")
            .subscribe((res:MessageModel[])=>{
                this.Messages = res;
                this.GetUsersByMessages();
                this.MessLoading = false;
            })
    }
    GetUsersByMessages(){
        let total = this.Messages.length;
        let current = 0;
        for(let item of this.Messages){
            if(!this.Users[item.from_id]){
                this.service.GetUserById(item.from_id)
                    .subscribe((res:UserModel)=>{
                        this.Users[item.from_id]=res;
                        current += 1;
                        
                    })
            }
            if(!this.Users[item.to_id]){
                this.service.GetUserById(item.to_id)
                    .subscribe((res:UserModel)=>{
                        this.Users[item.to_id]=res;
                    })
            }
        }
    }

    ReadMessages(item:MessageModel,modal:any){
        this.CurrentMessage = item;
        modal.show();
        this.service.MarkMessagesAsRead(item.id)
            .subscribe(()=>{
                
            },
        (err)=>{
            this.MessagesTypeChanged(this.MessagesMenu);
        })
    }

    SendMessage(){
        this.MessLoading = true;
        this.MessErr = false;
        this.MessOk = false;
        this.Message.to_id = this.MessagesMenu == "sent" ? this.CurrentMessage.to_id : this.CurrentMessage.from_id;
        if(!this.Message.title || !this.Message.body){
            this.MessErr = true;
            this.MessLoading = false;
            setTimeout(()=>{
                this.MessErr = false;
            },5000);
            return;
        }
        this.service.CreateMessage(this.Message)
            .subscribe((mes:MessageModel)=>{
                this.Message.title = "";
                this.Message.body = "";
                this.MessOk = true;
                this.MessagesTypeChanged(this.MessagesMenu);
                setTimeout(()=>{
                    this.MessOk = false;
                },5000);
            },
        (err:any)=>{
            this.MessErr = true;
            this.MessLoading = false;
            setTimeout(()=>{
                this.MessErr = false;
            },5000);
        })
    }

}