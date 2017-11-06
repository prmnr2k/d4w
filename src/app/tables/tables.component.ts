import { Component, OnInit } from '@angular/core';
import { CreateCoworkingModel } from '../core/models/createCoworking.model';
import { CheckboxModel } from '../core/models/checkbox.model';
import { UserModel } from '../core/models/user.model';
import { MainService } from '../core/services/main.service';
import { Router } from '@angular/router';
import { CoworkingModel } from '../core/models/coworking.model';
import { Base64ImageModel } from '../core/models/base64image.model';
import { BookingModel } from '../core/models/booking.model';


@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {

    isLoginErr = false;
    isLoading = true;
    Coworking = new CoworkingModel();
    Days:string[] = [];
    AmetiesCB: CheckboxModel[] = []; 
    Me:UserModel = new UserModel();
    Bookings:BookingModel[] = [];
    Users:UserModel[] = [];
    constructor(private service: MainService, private router: Router) { }

    ngOnInit() 
    {
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
                                    for(let book of this.Bookings){
                                        this.service.GetUserById(book.user_id)
                                            .subscribe((usr:UserModel)=>{
                                                this.Users[usr.id] = usr;
                                            })
                                    }
                                })
                        }
                    })
            })
        
    }

}
