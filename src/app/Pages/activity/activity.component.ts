import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RouterModule } from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';


import {MainService} from "./../../services/main.service";
import { ActivityModel } from '../../models/activity.model';
import { UserModel } from '../../models/user.model';
import { Base64ImageModel } from '../../models/base64image.model';
import { CommentModel } from '../../models/comment.model';
import { CreateBookingModel } from '../../models/createBooking.model';
import { BookingModel } from '../../models/booking.model';
import { CreateMessageModel } from '../../models/createMessage.model';
import { MessageModel } from '../../models/message.model';

@Component({
    moduleId:module.id,
    selector: "activity",
    templateUrl: "./activity.component.html",
    providers: [HttpService]
})

export class ActivityComponent implements OnInit{
    isLoggedIn = false;
    isLoading = true;
    Activity: ActivityModel = new ActivityModel();
    ActivityImg:string;
    Start:Date = new Date();
    Finish:Date = new Date();
    UserLogo:string = '';
    actId:number = 0;
    Comments:CommentModel[] = [];
    Users:UserModel[] = [];
    Images:string[] = [];
    Me:UserModel = new UserModel();
    MyBooking:BookingModel = new BookingModel();
    BookingDate:Date = new Date();
    Comment = {
        title: '',
        body: '',
        activity_id: 0
    }
    Booking:CreateBookingModel = new CreateBookingModel();
    Bookings:BookingModel[] = [];
    DateBookings: BookingModel[] = [];
    isBookingErr = false;
    Message:CreateMessageModel = new CreateMessageModel();
    MessOk = false;
    MessErr = false;
    MessLoading = false;
    isCommentErr = false;
    Available = 0;
    constructor(private router: Router,
        private service: MainService,
        private activatedRoute: ActivatedRoute){}

    ngOnInit(){
         this.activatedRoute.params.forEach((params:Params) => {
            this.isLoading = true;
            this.isLoggedIn = this.service.IsLogedIn();
            this.service.onAuthChange$
                .subscribe((isLogged:boolean)=>{
                    this.isLoggedIn = isLogged;
                    if(this.isLoggedIn){
                        this.service.GetMe()
                            .subscribe((res:UserModel)=>{
                                this.Me = res;
                            })
                        this.GetComments();
                        this.GetBookings();
                    }
                    else{
                        this.Me = new UserModel();
                    }
                })
            this.actId= params["id"];

            this.GetActivity();
            this.service.GetMe()
                .subscribe((res:UserModel)=>{
                    this.Me = res;
                })
        });
    }

    GetActivity(){
        this.service.GetActivity(this.actId)
            .subscribe((act:ActivityModel)=>{
                this.Activity = act;
                this.Booking.date = this.Activity.calendar[0].date;
                console.log(this.Booking.date);
                if(this.Activity.image_id){
                    this.service.GetImageById(this.Activity.image_id)
                        .subscribe((img:Base64ImageModel)=>{
                            this.ActivityImg = img.base64;
                        })
                }
                if(this.Activity.user_image_id){
                    this.service.GetImageById(this.Activity.user_image_id)
                    .subscribe((img:Base64ImageModel)=>{
                        this.UserLogo = img.base64;
                    })
                }
                this.GetComments();
                this.GetBookings();
                this.isLoading = false;
            });
    }


    GetComments(){
        this.service.GetAllComments({activity_id:this.Activity.id})
            .subscribe((res:CommentModel[])=>{
                this.Comments = res;
                for(let item of this.Comments){
                    if(item.user_image_id){
                        this.service.GetImageById(item.user_image_id)
                            .subscribe((img:Base64ImageModel)=>{
                                this.Images[item.user_id] = img.base64;
                            })
                        }
                }
            })
    }

    AddComment(){
        this.isCommentErr = false;
        if(!this.Comment.body){
            this.isCommentErr = true;
            return;
        }
        this.Comment.activity_id = this.Activity.id;
        this.service.CreateComment(this.Comment)
            .subscribe((res:CommentModel)=>{
                this.Comment = {
                    title:'',
                    body:'',
                    activity_id:this.Activity.id
                };
                this.GetComments();
            })
    }
    OnDeleteComment(item:CommentModel){
        this.service.DeleteComment(item.id)
            .subscribe(()=>{
                this.GetComments();
            })
    }

    CreateBooking(){
        this.isBookingErr = false;
        this.Booking.activity_id = this.Activity.id;
        if(this.Booking.num_of_participants > this.Activity.num_of_bookings){
            this.isBookingErr = true;
            this.Booking.num_of_participants = this.Activity.num_of_bookings;
            return;
        }
        this.service.CreateBooking(this.Booking)
            .subscribe((book:BookingModel)=>{
                this.GetBookings();
            },
        (err:any)=>{
            console.log(err);
            this.isBookingErr = true;
            setTimeout(()=>{
                this.isBookingErr = false;
            },5000)
        })
    }

    UpdateBooking(){
        this.isBookingErr = false;
        if(this.MyBooking.num_of_participants > this.Activity.num_of_bookings){
            this.isBookingErr = true;
            this.MyBooking.num_of_participants = this.Activity.num_of_bookings
            return;
        }
        this.service.UpdateBooking(this.MyBooking.id,{num_of_participants:this.MyBooking.num_of_participants,date:this.MyBooking.date})
            .subscribe((res:BookingModel)=>{
                this.MyBooking = res;
                this.GetBookings();
            },
            (err:any)=>{
                this.isBookingErr = true;
                setTimeout(()=>{
                    this.isBookingErr = false;
                },5000)
            })
    }
    Unsubscribe()
    {
        this.service.DeleteBooking(this.MyBooking.id)
            .subscribe(()=>{
                this.MyBooking = new BookingModel();
                this.GetBookings();
            })
    }
    GetBookings(){
        this.service.GetActivityBookings(this.Activity.id)
            .subscribe((res:BookingModel[])=>{
                this.Bookings = res;
                for(let item of this.Bookings){
                    if(this.isLoggedIn && this.Me && item.user_id == this.Me.id){
                        this.SetMyBooking(item);
                    }
                    if(item.user_image_id && !this.Images[item.user_id]){
                        this.service.GetImageById(item.user_image_id)
                            .subscribe((img:Base64ImageModel)=>{
                                this.Images[item.user_id] = img.base64;
                            });
                    }
                }
                if(this.isLoggedIn && this.Me && this.MyBooking && this.MyBooking.id){
                    this.BookingDate = this.MyBooking.date;
                    this.GetBookingsByDateSub(this.MyBooking.date);
                }
                else
                    this.GetBookingsByDateUnsub(this.Booking.date);
            })
    }

    SetMyBooking(bk:BookingModel){
        this.MyBooking.id = bk.id;
        this.MyBooking.num_of_participants = bk.num_of_participants;
        this.MyBooking.date = bk.date;
    }

    GetBookingsByDate(date:Date){
        this.DateBookings = this.Bookings
            .filter((obj:BookingModel)=> obj.date== date);
        console.log(this.Bookings);
        console.log(this.DateBookings);
        console.log(date);
        this.Available = this.Activity.num_of_bookings;
        for(let i of this.DateBookings){
            this.Available -= i.num_of_participants;
        }
    }

    GetBookingsByDateSub(date:Date){
        this.MyBooking.date = date;
        this.GetBookingsByDate(this.MyBooking.date);
        if(this.BookingDate == this.MyBooking.date){
            this.Available += this.MyBooking.num_of_participants;
        }
    }

    GetBookingsByDateUnsub(date:Date){
        this.Booking.date = date;
        this.GetBookingsByDate(this.Booking.date)
    }


    MyBookingNumOfPartsChanged($event:any){
        this.MyBooking.num_of_participants = $event;
    }

    SendMessage(){
        this.MessLoading = true;
        this.MessErr = false;
        this.MessOk = false;
        this.Message.to_id = this.Activity.user_id;
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
                this.MessLoading = false;
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