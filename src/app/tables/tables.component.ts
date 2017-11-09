import { Component, OnInit } from '@angular/core';
import { CreateCoworkingModel } from '../core/models/createCoworking.model';
import { CheckboxModel } from '../core/models/checkbox.model';
import { UserModel } from '../core/models/user.model';
import { MainService } from '../core/services/main.service';
import { Router } from '@angular/router';
import { CoworkingModel } from '../core/models/coworking.model';
import { Base64ImageModel } from '../core/models/base64image.model';
import { BookingModel } from '../core/models/booking.model';

import {OnClickEvent, OnRatingChangeEven, OnHoverRatingChangeEvent} from "angular-star-rating/star-rating-struct";
import { RateModel } from 'app/core/models/rate.model';

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
    Rates:RateModel[] = [];

    constructor(private service: MainService, private router: Router) { }
    
    
    ngOnInit() 
    {

        this.isLoading = true;
        this.service.GetMe()
            .subscribe((user:UserModel)=>{
                this.Me = user;
                this.service.GetAllCoworking({creator_id:this.Me.id})
                    .subscribe((cwr:CoworkingModel[])=>{
                        
                        if(cwr.length)
                        {
                            this.Coworking = cwr[0];
                            
                            this.service.GetBookingsByCwr(this.Coworking.id)
                                .subscribe((res:BookingModel[])=>{
                                    this.Bookings = res;
                                    
                                    this.service.getMyRates().subscribe((resp:RateModel[])=>{
                                        this.Rates = [];
                                        for(let i of resp){
                                            this.Rates[i.user_id] = i;
                                        }
                                        console.log(resp);
                                    });
                                    for(let book of this.Bookings){
                                       
                                        this.service.GetUserById(book.user_id)
                                            .subscribe((usr:UserModel)=>{
                                                this.Users[usr.id] = usr;
                                                this.isLoading = false;
                                               
                                                
                                            })
                                    }
                                })
                                
                        }
                    })
                    this.service.GetMyAccess()
                    .subscribe((res)=>{
                      this.meRole = res.role;
                    });
            })
        

        /*this.service.ValidateBooking(my_data).subscribe((response: Response)=>{
            console.log(response);
        });

            
        */
            

    }

    rateUser(id:number,score:string){
        this.service.rateUser(id, score).subscribe((respon:any)=>{
                console.log(respon);
                this.Rates[id] = respon;
        });
    }

    changeConfirmStart(index:any){
        
        this.service.bookingConfirmChangeStart(this.Bookings[index].id).subscribe((respon:BookingModel)=>{
                this.Bookings[index] = respon;
        });
    }

    changeConfirmEnd(index:any){
        
        this.service.bookingConfirmChangeEnd(this.Bookings[index].id).subscribe((respon:BookingModel)=>{
                this.Bookings[index] = respon;
                console.log(respon);
        });
    }





    onClickResult:OnClickEvent;
    onHoverRatingChangeResult:OnHoverRatingChangeEvent;
    onRatingChangeResult:OnRatingChangeEven;
 
    onClick = ($event:OnClickEvent) => {
        console.log('onClick $event: ', $event);
        this.onClickResult = $event;
    };
 
    onRatingChange = ($event:OnRatingChangeEven) => {
        console.log('onRatingUpdated $event: ', $event);
        this.onRatingChangeResult = $event;
    };
 
    onHoverRatingChange = ($event:OnHoverRatingChangeEvent) => {
        console.log('onHoverRatingChange $event: ', $event);
        this.onHoverRatingChangeResult = $event;
    };

}
