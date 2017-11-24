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

@Component({
  selector: 'my-coworkings',
  templateUrl: './myBookings.component.html'
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
          let total = this.Bookings.length, current = 0;
          for(let item of this.Bookings){
            this.service.GetCoworkingById(item.coworking_id)
              .subscribe((cwrk:CoworkingModel)=>{
                this.Coworkings[cwrk.id] = cwrk;
                current += 1;
               
              },
              err=>{
                current += 1;
                
              });
          }
        } 
      );

    }

    UnBooking(id:number){
      this.service.UnBooking(id)
      .subscribe((any)=>{
        this.GetMyBookings();
      });
    
    }


    
   

}
