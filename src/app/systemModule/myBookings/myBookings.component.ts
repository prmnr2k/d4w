import { Component, OnInit } from '@angular/core';
import { MainService } from '../../core/services/main.service';
import { Router } from '@angular/router';
import { CoworkingModel } from '../../core/models/coworking.model';
import { CreateCoworkingModel } from '../../core/models/createCoworking.model';
import { CheckboxModel } from '../../core/models/checkbox.model';
import { WorkingDayModel } from '../../core/models/workingDay.model';
import { TokenModel } from '../../core/models/token.model';
import { UserModel } from '../../core/models/user.model';
import { BookingModel} from '../../core/models/booking.model';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { BaseComponent } from 'app/core/base/base.component';
import { CoworkingComponent } from 'app/systemModule/pageCoworking/pageCoworking.component';
import { ShowHideTrigger } from 'app/shared/animations/showFade.animation';
import { startTimeRange } from '@angular/core/src/profile/wtf_impl';

@Component({
  selector: 'my-coworkings',
  templateUrl: './myBookings.component.html',
  animations:[
    ShowHideTrigger
  ]
})
export class MyBookingsComponent extends BaseComponent implements OnInit {
   
    RegistrationErr = false;
    Bookings:BookingModel[] = [];
    Coworkings:CoworkingModel[] = [];

    ngOnInit() 
    {
      this.GetMyBookings();
    }

    GetMyBookings(){
      this.Coworkings = [];
      this.Bookings = [];
      this.WaitBeforeLoading(
        ()=>this.service.GetMyBookings(),
        (res)=>{
          this.Bookings = res;
          this.GetCoworkings();
        } 
      );

    }

    GetCoworkings(){
      for(let item of this.Bookings){
        this.WaitBeforeLoading(
          () => this.service.GetCoworkingById(item.coworking_id),
          (res:CoworkingModel) => {
              this.Coworkings[res.id] = res;
          },
          (err)=>{
              console.log(err);
          }
        );
      }
    }

    UnBooking(id:number){
      this.WaitBeforeLoading(()=>
      this.service.UnBooking(id),
      ()=>{
        this.GetMyBookings();}
      );
    
    }


    
   

}
