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
import { Http } from '@angular/http/src/http';
//import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'page-coworking',
  templateUrl: './pageCoworking.component.html'
})
export class Coworking implements OnInit {

  BookingErr = false;
  BookingOk = false;
  isLoading = true;
  RegErrMsg = '';
  Coworking:CoworkingModel = new CoworkingModel();
  Days:string[] = [];
  AmetiesCB: CheckboxModel[] = []; 
  Me:UserModel = new UserModel();
  meRole:string = "guest";
  meCowork:number = 0;
  CoworkingId:number = 0;
  Images:Base64ImageModel[] = [];
  Booking:BookingModel = new BookingModel();
  bsValue: Date = new Date();
  toTime:string = '01:00';
  fromTime:string = '00:00';
  minDate: Date;
  receptionSend:boolean = false;
  minTime:string = '00:00';
  maxTime:string = '00:00';
  showTime:boolean = false;
  ErrBookingMsg:string = "Incorrect Date or Time!";
  //pushNot:NotificationsComponent = new NotificationsComponent();
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
            this.meCowork = res.coworking_id;
            console.log('res access',res);
            console.log(`role:`,this.meRole);
          });
          this.isLoading = false;
    });       
    this.Days = this.service.GetAllDays();   
    this.minDate = new Date();
   // this.minDate.setDate(this.minDate.getDate() - 1);
    this.Booking.begin_date = `2017-11-08T13:00`;
    this.Booking.end_date = `2017-11-08T15:00`;
    this.DateChange();
  }

  BookingCoworking(){
  
    this.Booking.coworking_id = this.Coworking.id;
    this.Booking.visitors_count = 1;
    this.Booking.begin_date = this.bsValue.getFullYear()+`-`+this.incr(this.bsValue.getMonth())+`-`+this.bsValue.getDate()+'T'+this.fromTime;
    this.Booking.end_date = this.bsValue.getFullYear()+`-`+this.incr(this.bsValue.getMonth())+`-`+this.bsValue.getDate()+'T'+this.toTime;
    console.log(`this Book = `,this.Booking);
    
   this.service.BookingCreate(this.Booking).
    subscribe( (any) =>{
      console.log(`i booking!!`,any);
      this.BookingErr = false;
      this.router.navigate(['/my_bookings']);
      this.BookingOk = true;
    },
    (err)=>{
      console.log(`error = `,err);
      if(this.showTime){
        if(err._body==`{"begin_date":["INVALID"]}`) this.ErrBookingMsg = `In Start Time Coworking isn't work!`;
        if(err._body==`{"end_date":["INVALID"]}`) this.ErrBookingMsg = `In End Time Coworking isn't work!`;
      }
      else this.ErrBookingMsg = `In This Date Coworking isn't work!`;
      this.BookingErr = true;
      this.BookingOk = false;
  });
  }

  incr(n:number){
    return n+1;
  }

  receptionCoworking(){
    if(! this.receptionSend){
      console.log(`i want reception Cowork!`);
      this.service.RequestReception(this.Coworking.id)
      .subscribe((any)=>{
        console.log(`request send!`);
      });
    }

    this.receptionSend = true;
  }

  OnBeginWorkChanged($event:any){
    let beginArr = $event.split(":");
    let beginHour =  +beginArr[0];
    
      let endHour = +beginArr[0] + 1;
     
      if(!this.validateMinTime(endHour+":"+beginArr[1]))  this.toTime = this.maxTime;
     else{
      let endHourString:string;
      if(endHour<10) endHourString="0"+endHour; else endHourString = ''+endHour;
      this.fromTime = $event;
      this.toTime = endHourString + ":" + beginArr[1];
     }

  }

  OnEndWorkChanged($event:any){
  
  // if(this.validateMinTime($event))
    this.toTime = $event;
 //   else this.toTime = this.maxTime;

    console.log(this.toTime);
  }

  validateMinTime($event:any){
    let endArr = $event.split(":");
    let endHour = +endArr[0];
    let endMin = +endArr[1];

    let maxArr = this.maxTime.split(":");
    let maxHour = +maxArr[0];
    let maxMin = +maxArr[1];
    
    if(endHour<maxHour){
      console.log('less');
      return true;
    }
    else if(endHour==maxHour&&endMin<=maxMin){
      console.log('equal',endMin,maxMin);
      return true;
    }
    else {
      console.log('no equal',endMin,maxMin);
      this.toTime = this.maxTime;
      return false;
    }
  }


  DateChange(){
    let tmpDay = this.Days[ (this.bsValue.getDay()+6)%7];
    this.showTime = false;
    this.minTime = '00:00';
    this.maxTime = '00:00';
    for(let i of this.Coworking.working_days){
      if(tmpDay==i.day){
        this.showTime = true;
        this.maxTime = i.end_work;
        this.minTime = i.begin_work;
        this.OnBeginWorkChanged(i.begin_work);
      }
    }
  }

  SendSMS(){
    this.service.SendSmsClickatell('380953570489','smsFrom SnollyPc');
    
  }


}


