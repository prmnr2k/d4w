import { Component, OnInit } from '@angular/core';
import { MainService } from '../core/services/main.service';
import { Router } from '@angular/router';
import { CoworkingModel } from '../core/models/coworking.model';
import { CreateCoworkingModel } from '../core/models/createCoworking.model';
import { CheckboxModel } from '../core/models/checkbox.model';
import { WorkingDayModel } from '../core/models/workingDay.model';
import { TokenModel } from '../core/models/token.model';
import { UserModel } from '../core/models/user.model';
import { BookingModel} from '../core/models/booking.model';
import { Base64ImageModel } from '../core/models/base64image.model';

@Component({
  selector: 'my-coworkings',
  templateUrl: './myBookings.component.html'
})
export class MyBookings implements OnInit {
   
    RegistrationErr = false;
    isLoading = true;
    Bookings:BookingModel[] = [];
    Coworkings:CoworkingModel[] = [];
    Images:string[] = [];

    constructor(private service: MainService, private router: Router) { }

    ngOnInit() 
    {
      this.Coworkings = [];
      this.Bookings = [];
      this.service.GetMyBookings()
      .subscribe((bk:BookingModel[])=>{
      console.log(`my-bookings: `,this.Bookings);
        for(let i of bk){
          this.service.GetCoworkingById(i.coworking_id)
          .subscribe((cwr:CoworkingModel)=>{
            this.Coworkings.push(cwr);
            this.Bookings.push(i);
          });
        }
        this.isLoading = false;
        console.log(`my-coworkings: `,this.Coworkings);
      });
    }


    UnBooking(id:number){
      this.service.UnBooking(id)
      .subscribe((any)=>{
        console.log(`unbook `,id);
        location.reload();
      });
    
    }


    
   

}
