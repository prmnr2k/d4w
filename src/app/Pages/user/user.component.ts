import { Component,OnInit,AfterViewChecked,ElementRef, ViewChild }      from '@angular/core';
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
import { ChatModel } from '../../models/chat.model';

@Component({
    moduleId:module.id,
    selector: "user",
    templateUrl: "./user.component.html",
    providers: [HttpService]
})

export class UserComponent implements OnInit,AfterViewChecked{
    isLoading = true;
    User:UserModel = new UserModel();
    isMe = false;
    Logo:string = "./app/images/man.jpg";
    Background:string = "./app/images/hero-back.png";
    Diploma:string = '';
    ProfLoading = true;
    MenuItem = "bookings";
    ProfileMenu = "profile";
    Activities:ActivityModel[]=[];
    ActImages:string[] = [];
    ActLoading = true;
    UserUpdate:CreateUserModel = new CreateUserModel();
    Messages:MessageModel[] = [];
    ChatList:ChatModel[] = [];
    MessLoading = true;
    ChatsLoading = true;
    Message:MessageModel = new MessageModel();
    CurrentChat = new ChatModel();
    MessOk = false;
    MessErr = false;
    BookingLoading = true;
    BookingsMenu = "future";
    Bookings:BookingModel[] = [];
    BookingsActivities: ActivityModel[] = [];
    
    Users:UserModel[] = [];
    constructor(private router: Router,
        private service: MainService,
        private activatedRoute: ActivatedRoute){}
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    ngOnInit(){
        this.activatedRoute.params.forEach((params:Params) => {
            this.isLoading = true;
            let userId = params["id"];
            
            if(userId == 'me' || userId == this.service.me.id){
                
                this.isMe = true;
                let menu = params["menu"];
                if(menu)
                    this.MenuItem = menu;
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
        this.scrollToBottom();
    }
    ngAfterViewChecked() {        
        this.scrollToBottom();        
    } 
    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }                 
    }
    SetMenuItem(item:string){
        this.MenuItem = item;
    }

    AfterGettingUser(user:UserModel){
       
        this.ProfLoading = true;
        this.User = user;
        if(this.User){
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
        }
       
        this.GetActivityies();
        this.GetChatList();
        this.BookingsTypeChanged(this.BookingsMenu);
        this.ProfLoading = false;
        this.isLoading = false;
    }

    GetChatList(){
        this.ChatsLoading = true;
        this.service.GetChatsByUsers()
            .subscribe((res:ChatModel[])=>{
                this.ChatList = res;
                this.ChatsLoading = false; 
            },
            (err)=>{
                console.log(err);
                this.ChatsLoading = false;
            })
    }
    GetActivityies(){
        this.ActLoading = true;
        if(this.User){
            this.service.GetAllActivities({user_id:this.User.id})
                .subscribe((res:ActivityModel[])=>{
                    this.Activities = res;
                    let total = this.Activities.length;
                    let current = 0;
                    if(total == 0)
                    {
                        this.ActLoading = false;
                    }
                    for(let item of this.Activities){
                        if(item.image_id){
                            this.service.GetImageById(item.image_id)
                                .subscribe((res:Base64ImageModel)=>{
                                    this.ActImages[item.id]=res.base64;
                                    current += 1;
                                    if(total==current){
                                        this.ActLoading = false;
                                    }
                                })
                        }
                        else{
                            current += 1;
                            if(total==current){
                                this.ActLoading = false;
                            }
                        }
                    }
                })
        }
    }

    ChangePw(old_password:string,new_password:string){
        this.ProfLoading = true;
        this.service.ChangePassword(old_password,new_password)
            .subscribe((res:UserModel)=>{
                this.AfterGettingUser(res);
            },
            (err:any)=>{
                this.ProfLoading = false;
            })
    }

    UpdateUser(){
        this.ProfLoading = true;
        this.service.UpdateUser(this.User.id,this.UserUpdate)
            .subscribe((res:UserModel)=>{
                console.log(res);
                this.AfterGettingUser(res);
            },
        (err)=>{
            this.ProfLoading = false;
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
            },
            (err)=>{
                this.GetBookingsErr();
            })
    }

    GetPastBookings(){
        this.service.GetPastBookings()
            .subscribe((res:BookingModel[])=>{
                this.Bookings = res;
                this.GetActivitiesByBookings();
            },
        (err)=>{
            this.GetBookingsErr();
        })
    }

    GetBookingsErr(){
        this.BookingLoading = false;
    }

    GetActivitiesByBookings(){
        let total = this.Bookings.length;
        let current = 0;
        if(total == 0){
            this.BookingLoading = false;
        }
        for(let item of this.Bookings){
            this.service.GetActivity(item.activity_id)
                .subscribe((res:ActivityModel)=>{
                    this.BookingsActivities[res.id] = res;
                    current += 1;
                    if(current == total)
                        this.BookingLoading = false;
                },
            (err)=>{
                current += 1;
                if(current == total)
                    this.BookingLoading = false;
            })
        }
        
    }


    ReadMessages(item:ChatModel,modal:any){
        this.MessLoading = true;
        this.CurrentChat = item;
        modal.show();
        this.GetMessages();
        
    }

    SendMessage(){
        this.MessLoading = true;
        this.MessErr = false;
        this.MessOk = false;
        this.Message.to_id = this.CurrentChat.id;
        if(!this.Message.body){
            this.MessErr = true;
            this.MessLoading = false;
            setTimeout(()=>{
                this.MessErr = false;
            },5000);
            return;
        }
        this.service.CreateMessage(this.Message)
            .subscribe((mes:MessageModel)=>{
                this.Message.body = "";
                this.GetMessages();
            },
        (err:any)=>{
            this.MessErr = true;
            this.MessLoading = false;
            setTimeout(()=>{
                this.MessErr = false;
            },5000);
        })
    }
    
    GetMessages(){
        this.MessLoading = true;
        this.service.GetChatHistory({user_id:this.CurrentChat.id})
        .subscribe((res:MessageModel[])=>{
            this.Messages = res;
            
            this.service.MarkAllAsRead(this.CurrentChat.id)
                .subscribe(()=>{
                    this.MessLoading = false;
                    this.GetChatList();
                });
        },
        (err)=>{
            this.Messages = [];
            this.MessLoading = false;
        });
    }

}