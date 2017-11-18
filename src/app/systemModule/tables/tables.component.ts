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

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {

    isLoginErr = false;
    isLoading:boolean;
    Coworking = new CoworkingModel();
    Days:string[] = [];
    AmetiesCB: CheckboxModel[] = []; 
    Me:UserModel = new UserModel();
    Bookings:BookingModel[] = [];
    Users:UserModel[] = [];
    meRole:string = 'guest';
    meCwrk:number = 0;
    Rates:RateModel[] = [];
    canAccess:boolean = false;
    bsValue:Date= new Date();
    WorkingPlaces:number[] = [];
    
    constructor(private service: MainService, private router: Router) { }
    
    
    ngOnInit() 
    {

        this.isLoading = true;
        this.bsValue = new Date();
        this.service.GetMyAccess()
        .subscribe((res)=>{
          this.meRole = res.role;
          this.meCwrk = res.coworking_id;
          if(this.meRole=='creator'||this.meRole=='receptionist')this.canAccess = true;
            console.log(`router`,this.router);
          if(!this.canAccess)this.router.navigate(['/system','all_coworkings']);
            this.service.GetMe()
            .subscribe((user:UserModel)=>{
                this.Me = user;
                this.service.GetCoworkingById(this.meCwrk)
                    .subscribe((cwr:CoworkingModel)=>{
                        
                        if(cwr)
                        {
                            this.Coworking = cwr;
                            let i = 1;
                            this.WorkingPlaces = Array(this.Coworking.capacity).fill(1).map((x,i)=>i+1);

                            this.GetBookings();
                                
                        }
                    })
                   
            })
        });

        
            

    }

    GetBookings(date?:Date){
        if(date)
            this.bsValue = date;
        let dateStr = this.bsValue.toISOString().split('T')[0];
        //let dateObj = date.toLocaleDateString();
        this.service.GetBookingsByCwr(this.Coworking.id,{date:dateStr})
            .subscribe((res:BookingModel[])=>{
                this.Bookings=res;
                this.service.getMyRates().subscribe((resp:RateModel[])=>{
                    this.Rates = [];
                    for(let i of resp){
                        this.Rates[i.user_id] = i;
                    }
                    
                });
                
                if(!res.length){
                    this.isLoading = false;
                }

                for(let book of res){
                
                    this.service.GetUserById(book.user_id)
                        .subscribe((usr:UserModel)=>{
                            this.Users[usr.id] = usr;
                            this.isLoading = false;
                        
                            
                        })
                }
                setTimeout(()=>{
                    this.SetPositions();
                },500);
            })
    }

    

    GetBookingsBySeatNumber(n:number):BookingModel[]{
        return this.Bookings.filter(x=>x.seat_number == n);
    }

    SetPositions(){

        $(".one-user-state").each(function () {
            let width = count_time_width($(this).find(".from").text(), $(this).find(".to").text());
            console.log(width);
            let margin = 0;
            if ($(this).find(".from").text() != '00:00') {
                margin = count_time_width('00:00', $(this).find(".from").text());
            }
            $(this).css({
                "width": width + "%"
                ,"left": margin + "%"
            });
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
                //console.log(respon);
                this.Rates[id] = respon;
        });
    }

    changeConfirmStart(index:any){
        
        /*this.service.bookingConfirmChangeStart(this.Bookings[index].id).subscribe((respon:BookingModel)=>{
                this.Bookings[index] = respon;
        });*/
    }

    changeConfirmEnd(index:any){
        
        /*this.service.bookingConfirmChangeEnd(this.Bookings[index].id).subscribe((respon:BookingModel)=>{
                this.Bookings[index] = respon;
                console.log(respon);
        });*/
    }





    onClickResult:OnClickEvent;
    onHoverRatingChangeResult:OnHoverRatingChangeEvent;
    onRatingChangeResult:OnRatingChangeEven;
 
    onClick = ($event:OnClickEvent) => {
        //console.log('onClick $event: ', $event);
        this.onClickResult = $event;
    };
 
    onRatingChange = ($event:OnRatingChangeEven) => {
        //console.log('onRatingUpdated $event: ', $event);
        this.onRatingChangeResult = $event;
    };
 
    onHoverRatingChange = ($event:OnHoverRatingChangeEvent) => {
        //console.log('onHoverRatingChange $event: ', $event);
        this.onHoverRatingChangeResult = $event;
    };

}
