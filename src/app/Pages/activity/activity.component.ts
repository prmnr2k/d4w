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

@Component({
    moduleId:module.id,
    selector: "activity",
    templateUrl: "./activity.component.html",
    providers: [HttpService]
})

export class ActivityComponent implements OnInit{
    isLoading = true;
    Activity: ActivityModel = new ActivityModel();
    ActivityImg:string;
    User:UserModel = new UserModel();
    Start:Date = new Date();
    Finish:Date = new Date();
    UserLogo:string = '';
    actId:number = 0;
    Comments:CommentModel[] = [];
    Users:UserModel[] = [];
    Images:string[] = [];
    Me:UserModel = new UserModel();
    Comment = {
        title: '',
        body: '',
        activity_id: 0
    }
    Booking:CreateBookingModel = new CreateBookingModel();
    Bookings:BookingModel[] = [];
    constructor(private router: Router,
        private service: MainService,
        private activatedRoute: ActivatedRoute){}

    ngOnInit(){
         this.activatedRoute.params.forEach((params:Params) => {
            this.isLoading = true;
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
                
                this.Start = this.Start > this.Activity.calendar[0].date?this.Start:this.Activity.calendar[0].date;
                this.Finish = this.Start < this.Activity.calendar[1].date? this.Activity.calendar[1].date: null;
                if(this.Activity.image_id){
                    this.service.GetImageById(this.Activity.image_id)
                        .subscribe((img:Base64ImageModel)=>{
                            this.ActivityImg = img.base64;
                        })
                }
                this.GetUserInfo();
                this.GetComments();
                this.GetBookings();
            });
    }

    GetUserInfo(){
        this.service.GetUserById(this.Activity.user_id)
            .subscribe((user:UserModel)=>{
                this.User = user;
                if(this.User.image_id){
                    this.service.GetImageById(this.User.image_id)
                        .subscribe((img:Base64ImageModel)=>{
                            this.UserLogo = img.base64;
                        })
                }
                
                this.isLoading = false;
            })
    }

    GetComments(){
        this.service.GetAllComments({activity_id:this.Activity.id})
            .subscribe((res:CommentModel[])=>{
                this.Comments = res;
                this.GetUsers();
            })
    }

    GetUsers(){
        for(let item of this.Comments){
            this.service.GetUserById(item.user_id)
                .subscribe((user:UserModel)=>{
                    this.Users[user.id] = user;
                    if(user.image_id){
                        this.service.GetImageById(user.image_id)
                            .subscribe((image:Base64ImageModel)=>{
                                this.Images[user.id] = image.base64;
                            })
                    }
                })
        }
    }

    AddComment(){
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
        this.service.DeleteComment(item.id,{activity_id:item.activity_id,title:item.title,body:item.body})
            .subscribe(()=>{
                this.GetComments();
            })
    }

    CreateBooking(){
        console.log(this.Booking);
        this.Booking.activity_id = this.Activity.id;
        this.service.CreateBooking(this.Booking)
            .subscribe((book:BookingModel)=>{
                this.GetBookings();
            })
    }

    GetBookings(){
        this.service.GetActivityBookings(this.Activity.id)
            .subscribe((res:BookingModel[])=>{
                this.Bookings = res;
            })
    }
}