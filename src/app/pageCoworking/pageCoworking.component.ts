import { Component, OnInit } from '@angular/core';
import { MainService } from '../core/services/main.service';
import { Router,ActivatedRoute } from '@angular/router';
import { CoworkingModel } from '../core/models/coworking.model';
import { CreateCoworkingModel } from '../core/models/createCoworking.model';
import { CheckboxModel } from '../core/models/checkbox.model';
import { WorkingDayModel } from '../core/models/workingDay.model';
import { TokenModel } from '../core/models/token.model';
import { UserModel } from '../core/models/user.model';
import { BookingModel } from "../core/models/booking.model";
import { Base64ImageModel } from '../core/models/base64image.model';

@Component({
  selector: 'page-coworking',
  templateUrl: './pageCoworking.component.html'
})
export class Coworking implements OnInit {

 
  bsValue: Date = new Date();


  RegistrationErr = false;
  isLoading = true;
  RegErrMsg = '';
  Coworking:CoworkingModel = new CoworkingModel();
  Days:string[] = [];
  AmetiesCB: CheckboxModel[] = []; 
  Me:UserModel = new UserModel();
  meRole:string = null;
  CoworkingId:number = 0;
  Images:Base64ImageModel[] = [];
  Booking:BookingModel = new BookingModel();
  constructor(private service: MainService, private router: Router, 
  private activatedRoute: ActivatedRoute) { }

  ngOnInit() 
  {
    this.activatedRoute.params.forEach((params) => {
    this.CoworkingId = params["id"];
    });

    
    this.service.GetCoworkingById(this.CoworkingId)
    .subscribe((cwr:CoworkingModel)=>{
      this.Coworking = cwr;
      this.AmetiesCB = this.service.SetCheckedCB(this.service.GetAllAmenties(),cwr.amenties);
      for(let item of cwr.images){
      this.service.GetImageById(item.id)
      .subscribe((img:Base64ImageModel)=>{
        this.Images.push(img);

      });
      
    }

        this.service.GetMyAccess()
        .subscribe((res)=>{
          this.meRole = res.role;
          console.log(`role:`,this.meRole);
        });
        this.isLoading = false;
  });       
  this.Days = this.service.GetAllDays();   
 
  }

  BookingCoworking(){
    
    this.Booking.coworking_id = this.Coworking.id;
    this.Booking.begin_date = `2017-11-08T13:00`;
    this.Booking.end_date = `2017-11-08T15:00`;
    this.Booking.visitors_count = 1;
    console.log(`this Book = `,this.Booking);
   this.service.BookingCreate(this.Booking).
    subscribe( (any) =>{
      console.log(`i booking!!`,any);
    });
  }

}


