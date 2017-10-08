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
import { RateModel } from '../../models/rate.model';

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
   // ParamsRate: RateModel = new RateModel();
    Comment = {
        title: '',
        body: '',
        activity_id: 0
    }

    ParamsRate={
        activity_id:null,
        rate:null
    }

    TotalRate:RateModel = new RateModel();
    MyRate:RateModel = new RateModel();

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
    

    pukCount:number = 5;
    pukEmptyImage:string = './app/images/empty-star-icon.png';
    pukFullImage:string = './app/images/star-icon.png';
    pukHalfImage:string = './app/images/half-star-icon.png';
    pukImageWidth:string = '30px';
    pukImageHeight:string = '30px';
    pukHoverIndex:number;
    pukList:number[] = [];

    constructor(private router: Router,
        private service: MainService,
        private activatedRoute: ActivatedRoute){}

    ngOnInit(){

        for (let i = 1; i <= this.pukCount; i++) {
            this.pukList.push(i);
        }

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

                
                this.TotalRate.rate=act.rate;
                this.ParamsRate.activity_id=act.id;
              
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
                this.getRate();
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
            });

        this.service.UnRateActivity({activity_id:this.ParamsRate.activity_id})
            .subscribe(()=>{
                console.log(`unrate it!!`);
                this.GetActivity();},
            (err:any)=>{
                console.log(err);
            });
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


    pukChangeSvg(newPukValue:number):void {
        if(this.canRate())
        this.MyRate.rate = newPukValue;
    };


    pukChangeImage(newPukValue:number):void {
        if(this.canRate())
        this.MyRate.rate  = newPukValue;
    };


    pukHover(pukValue:number) {
        if(this.canRate())
        this.pukHoverIndex = pukValue;
    }

    private onClickRate(pukModel:number):void {
        if(this.canRate()){
            this.MyRate.rate = pukModel;


        this.setRate();
    }
       
    }

    private onMouseEnterRate(pukModel:number):void {
        if(this.canRate())
                this.pukHoverIndex = pukModel;        
     }
        
    private onMouseLeaveRate():void{
        if(this.canRate())
        this.pukHoverIndex = null;
    }

    private getStyleRate(index:number):Object {
        if (this.pukEmptyImage && this.pukFullImage) {

            let image_url;
            if (this.pukHoverIndex) {
                image_url = index <= this.pukHoverIndex ? this.pukFullImage : this.pukEmptyImage;
            }
            else {
                image_url = index <= this.MyRate.rate ? this.pukFullImage : this.pukEmptyImage;
            }

            return {
                "background-size": this.pukImageWidth + ' ' + this.pukImageHeight,
                "background-image": "url(" + image_url + ")",
                "display": "inline-block",
                "width": this.pukImageWidth,
                "height": this.pukImageHeight
            };
        }

    }

    private getStyleColor():Object {
       let color:string='red';
        if(this.MyRate.rate==5)color=`#0b60a3`;
        else if(this.MyRate.rate>=4)color=`#00a8b0`;
        else if(this.MyRate.rate>=3)color=`#67b548`;
        else if(this.MyRate.rate>=2)color=`#89cf6d`;
        else if(this.MyRate.rate>=1)color=`#b05153`;
        else if(this.MyRate.rate==0)color=`#FF00FF`;
            return {
                
                "background-color": color
            };
        }

    private setRate(){
        if(this.canRate()){
            console.log(this.service.getTok());
            if(this.isLoggedIn&&this.MyBooking.id>0){

            this.service.UnRateActivity(this.ParamsRate.activity_id)
            .subscribe(()=>{
                console.log(`unrate it!!`);},
            (err:any)=>{
                console.log(err);
            });
            this.ParamsRate.rate = this.MyRate.rate;
            this.service.RateActivity(this.ParamsRate)
            .subscribe(()=>{
                console.log(`rate it!!`);
            this.GetActivity()},
            (err:any)=>{
                console.log(err);
            });}
            else console.log(`not auth!`);
        }
    }

    EditActivity(){
        this.router.navigate(['/edit_act',this.Activity.id]);
    }

    DeleteActivity(){
        this.service.DeleteActivity(this.Activity.id)
            .subscribe(()=>{
                this.router.navigate(['/users','me',{menu:'activity'}]);
            },
        (err)=>{
            console.log(err);
        })
    }

    datePrev()
    {
        let isDatePrev:boolean = false;
        let today: Date = new Date();
        for (var item of this.Activity.calendar) {
            let cur: Date = new Date(item.date);
            if (today>cur) isDatePrev = true;   
        }
        return isDatePrev;
    }

    private canRate()
    {
        let canRate:boolean = false;
        if ( this.MyBooking.id > 0 && this.Me.id != this.Activity.user_id) canRate = true;
        return canRate;
    }

    private getRate(){

        this.service.GetRate(this.Activity.id)
        .subscribe((res:RateModel)=>{
            this.MyRate = res;
        });

        
    }

    private getStyleRateTotal(index:number):Object {
        if (this.pukEmptyImage && this.pukFullImage) {

            let image_url;
            if (index<=this.TotalRate.rate) {
                image_url = this.pukFullImage;
            }
            else if(index<this.TotalRate.rate+1)
            {
                image_url = this.pukHalfImage;
            }

            else {
                image_url = this.pukEmptyImage;
            }

            return {
                "background-size": this.pukImageWidth + ' ' + this.pukImageHeight,
                "background-image": "url(" + image_url + ")",
                "display": "inline-block",
                "width": this.pukImageWidth,
                "height": this.pukImageHeight
            };
        }

    }

    private getStyleColorTotal():Object {
       let color:string='red';
        if(this.TotalRate.rate==5)color=`#0b60a3`;
        else if(this.TotalRate.rate>=4)color=`#00a8b0`;
        else if(this.TotalRate.rate>=3)color=`#67b548`;
        else if(this.TotalRate.rate>=2)color=`#89cf6d`;
        else if(this.TotalRate.rate>=1)color=`#b05153`;
        else if(this.TotalRate.rate==0)color=`#FF00FF`;
            return {
                
                "background-color": color
            };
        }

}