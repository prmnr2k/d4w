import { Component, OnInit } from '@angular/core';
import { MainService } from '../../core/services/main.service';
import { Router,ActivatedRoute } from '@angular/router';
import { CoworkingModel } from '../../core/models/coworking.model';
import { CreateCoworkingModel } from '../../core/models/createCoworking.model';
import { CheckboxModel } from '../../core/models/checkbox.model';
import { WorkingDayModel } from '../../core/models/workingDay.model';
import { TokenModel } from '../../core/models/token.model';
import { UserModel } from '../../core/models/user.model';
import { BookingModel } from "../../core/models/booking.model";
import { Base64ImageModel } from '../../core/models/base64image.model';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operator/take';
import { RateModel } from '../../core/models/rate.model';

@Component({
  selector: 'id-booking',
  templateUrl: './idBooking.component.html',
  styleUrls: ['./idBooking.css']
})
export class IdBookingComponent implements OnInit {

    Me:UserModel = new UserModel();
    BookingId:number = 0;
    Coworking = new CoworkingModel();
    Rate:RateModel = new RateModel();
    meCwrk:number = 0;
    Booking = new BookingModel();
    rightNow: Date;
    timerSubscription: any = null;
    isLoading = false;
    constructor(private service: MainService, private router: Router, 
        private activatedRoute: ActivatedRoute) { 
        }

 
  ngOnInit() 
  {
    this.activatedRoute.params.forEach((params) => {
      this.isLoading = true;
      this.BookingId = params["id"];
      this.service.GetBookingById(this.BookingId)
      .subscribe((res:BookingModel)=>{
          this.Booking = res;
          this.service.GetCoworkingById(this.Booking.coworking_id)
          .subscribe((cow:CoworkingModel)=>{
            this.Coworking = cow;
            let timer = Observable.timer(1000, 1000);
            this.timerSubscription = timer.subscribe((t:any) => {
                this.timerExecuted();
            });
            this.service.GetMe()
            .subscribe((um:UserModel)=>{
              this.Me = um;
              console.log('getMe ',um, this.Me);
            });
          });
          setTimeout(()=>{
            this.isLoading = false;
          },
          300);
      });
    });
    
  }
  private timerExecuted(): void {
    var currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 2);  //subtract 2 hours or 120 minutes from current date
    this.rightNow = currentDate;
}

  extendBooking() {
    confirm("Extend will be confirmed by administrator! ")
    this.service.ExtendBooking(this.Booking.id, "00:30")
    .subscribe((res:any)=>{
      console.log("RES" + res);
    })
  }
   

  rateCoworking(id:number,score:string){
    console.log(`rateCWRK `,id, this.Me.id, score);
    this.service.RateCoworking(id, this.Me.id, score).subscribe((respon:any)=>{
            console.log(respon);
            this.Rate = respon;
    });
}
}