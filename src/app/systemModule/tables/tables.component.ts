import { Component, OnInit } from '@angular/core';
import { CreateCoworkingModel } from '../../core/models/createCoworking.model';
import { CheckboxModel } from '../../core/models/checkbox.model';
import { UserModel } from '../../core/models/user.model';
import { MainService } from '../../core/services/main.service';
import { Router } from '@angular/router';
import { CoworkingModel } from '../../core/models/coworking.model';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { BookingModel } from '../../core/models/booking.model';

import {OnClickEvent, OnRatingChangeEven, OnHoverRatingChangeEvent} from "angular-star-rating/star-rating-struct";
import { RateModel } from 'app/core/models/rate.model';
import { Ng2Cable, Broadcaster } from 'ng2-cable';
import { BaseComponent } from 'app/core/base/base.component';
import { ShowHideTrigger } from 'app/shared/animations/showFade.animation';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css'],
  animations:[
    ShowHideTrigger
  ]
})
export class TablesComponent extends BaseComponent implements OnInit {
    Coworking = new CoworkingModel();
    Days:string[] = [];
    ExtendRequest:any = [];
    Bookings:BookingModel[] = [];
    Users:UserModel[] = [];
    meCwrk:number = 0;
    Rates:RateModel[] = [];
    bsValue:Date= new Date();
    WorkingPlaces:number[] = [];
    Images:string[] = [];
    activeBooking:BookingModel = new BookingModel();
    bsConfig = Object.assign({}, { containerClass: "theme-blue"});
    ngOnInit() 
    {
        this.bsValue = new Date();
        

        this.BaseInit();
    }


    ApplyExtendBooking(id:number){
        this.service.ApplyExtendRequest(id).subscribe(
            (res:any)=>{
                console.log(res);
                this.ExtendRequest = [];
                this.GetMyCoworking();
            },
            (err)=>{
                console.log(err);
            }
        );
    }

    GetExtendsbyUsers(id:number){
        this.service.GetExendRequests(id).subscribe(
            (res:any)=>{
                console.log(res);
                this.ExtendRequest = res;
            },
            (err)=>{
                console.log(err);
            }
        );
    }



    CloseModalMenu(){
        $("body").removeClass("has-active-menu");
        $(".mainWrapper").removeClass("has-push-left");
        $(".nav-holder-3").removeClass("is-active");
        $(".mask-nav-3").removeClass("is-active");
    }
    
    GetMyCoworking(){
        this.WaitBeforeLoading(
            ()=>this.service.GetCoworkingById(this.Me.coworking_id?this.Me.coworking_id:(this.meCwrk?this.meCwrk:null)),
            (res:CoworkingModel) => {
                if(res){
                    this.Coworking = res;
                    let i = 1;
                    this.WorkingPlaces = Array(this.Coworking.capacity).fill(1).map((x,i)=>i+1);
                    
                    this.GetBookings();
                }
            },
            (err:any)=>{
                console.log(err);
            }
        );
    }

    BaseInit(){
        this.GetMyAccess((result)=>{
            if(result){
                this.meCwrk = result.coworking_id;
                this.GetMyCoworking();
            }
            else{
                console.log("access denied");
            }

        });

    }

    GetBookings(date?:Date){
        if(date){
            this.bsValue = date;
        }
              
        //let dateStr = this.bsValue.toISOString().split('T')[0]; //with UTC
        //todo протестить на всех поисковиках формат даты
        let dateStr = this.bsValue.getFullYear()+'-'+(this.bsValue.getMonth()+1)+'-'+this.bsValue.getDate();
       
        this.WaitBeforeLoading(
            ()=> this.service.GetBookingsByCwr(this.Coworking.id,{date:dateStr}),
            (res:BookingModel[])=> {
                this.Bookings = res;
                setTimeout(
                    ()=> this.SetPositions(()=>{}),
                300);
                
                this.GetUsers();
                this.GetMyRates();     
            },
            (err)=>{
                console.log(err);
            }
        )
    }

    GetUserImage(user:UserModel){
        if(user.image_id){
            this.WaitBeforeLoading(
                ()=>this.service.GetImageById(user.image_id),
                (res:Base64ImageModel)=>{
                    this.Images[user.id] = res.base64;
                },
                (err)=>{
                    console.log(err);
                }


            );
        }
    }

    GetMyRates(){

        this.WaitBeforeLoading(
            ()=>this.service.getMyRates(),
            (res:RateModel[])=>{
                this.Rates = [];
                for(let i of res){
                    this.Rates[i.user_id] = i;
                }
            },
            (err)=>{
                console.log(err);
            }


        );


    }

    GetUsers(){
        for(let i of this.Bookings){
            this.WaitBeforeLoading(
                ()=>this.service.GetUserById(i.user_id),
                (res:UserModel)=>{
                    this.Users[res.id] = res;
                    this.GetUserImage(res);
                },
                (err)=>{
                    console.log(err);
                }

            );
        }
    }

    openModal(e:any,book:BookingModel){
        this.activeBooking = book;
        this.GetExtendsbyUsers(this.activeBooking.id);
        e.preventDefault();
        $("body").addClass("has-active-menu");
        $(".mainWrapper").addClass("has-push-left");
        $(".nav-holder-3").addClass("is-active");
        $(".mask-nav-3").addClass("is-active");
        


    }

    closeModal(e:any){
        e.preventDefault();
        $("body").removeClass("has-active-menu");
        $(".mainWrapper").removeClass("has-push-left");
        $(".nav-holder-3").removeClass("is-active");
        $(".mask-nav-3").removeClass("is-active")
    }

    GetBookingsBySeatNumber(n:number):BookingModel[]{
        return this.Bookings.filter(x=>x.seat_number == n);
    }

    SetPositions(callback:()=>void)
    {
       /* if($(".one-user-state").length == 0){
            callback();
            return;
        }*/

        $(".one-user-state").each(function (e) {
            let width = count_time_width($(this).find(".from").text(), $(this).find(".to").text());
            let margin = 0;
            if ($(this).find(".from").text() != '00:00') {
                margin = count_time_width('00:00', $(this).find(".from").text());
            }
            $(this).css({
                "width": width + "%"
                ,"left": margin + "%"
            });
            if((parseInt($(this).find(".to").text())-parseInt($(this).find(".from").text()))<=6){
                $(this).parents(".place-info").addClass("height-big");
                $(this).addClass("small-block");
            }
           /*if(e == ($(".one-user-state").length - 1)){
                callback();
            }*/
        });
        
        function count_time_width(firstDate, secondDate) {
            let getDate = (string) => new Date(0, 0, 0, string.split(':')[0], string.split(':')[1]);
            let different = ((+getDate(secondDate)) - (+getDate(firstDate)));
            let differentRes, hours, minuts;
            if (different > 0) {
                differentRes = different;
                hours = Math.floor((differentRes % 86400000) / 3600000);
                minuts = Math.round(((differentRes % 86400000) % 3600000) / 60000);
            }
            else {
                differentRes = Math.abs(((+getDate(firstDate)) - (+getDate(secondDate))));
                hours = Math.floor(24 - (differentRes % 86400000) / 3600000);
                minuts = Math.round(60 - ((differentRes % 86400000) % 3600000) / 60000);
            }
            return (hours * 60 + minuts) * 0.06941667;
        }

    }


    rateUser(id:number,score:string){
        this.service.rateUser(id, score).subscribe((respon:any)=>{
                this.Rates[id] = respon;
        });
    }

    changeConfirmStart(book:BookingModel){
        let index = this.Bookings.findIndex(x=>x.id == book.id);
        if(index>-1){
            this.service.bookingConfirmChangeStart(this.Bookings[index].id).subscribe((respon:BookingModel)=>{
                this.safeUpdateBooking(index,respon);
        });
        }
        
       
    }

    safeUpdateBooking(index:number,booking:BookingModel){
        if(this.Bookings[index].id == booking.id){

            this.Bookings[index].is_visit_confirmed = this.activeBooking.is_visit_confirmed = booking.is_visit_confirmed;
            this.Bookings[index].is_closed = this.activeBooking.is_closed = booking.is_closed;

        }
    }


    changeConfirmEnd(book:BookingModel){
        let index = this.Bookings.findIndex(x=>x.id == book.id);
        if(index>-1){
            this.service.bookingConfirmChangeEnd(this.Bookings[index].id).subscribe((respon:BookingModel)=>{
                this.safeUpdateBooking(index,respon);
             });
        }
      
    }





    onClickResult:OnClickEvent;
    onHoverRatingChangeResult:OnHoverRatingChangeEvent;
    onRatingChangeResult:OnRatingChangeEven;
 
    onClick = ($event:OnClickEvent) => {
        this.onClickResult = $event;
    };
 
    onRatingChange = ($event:OnRatingChangeEven) => {
        this.onRatingChangeResult = $event;
    };
 
    onHoverRatingChange = ($event:OnHoverRatingChangeEvent) => {
        this.onHoverRatingChangeResult = $event;
    };

}
