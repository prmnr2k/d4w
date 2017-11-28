import { Component, OnInit } from '@angular/core';
import { MainService } from '../../core/services/main.service';
import { Router,ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http/src/http';
//import { NotificationsComponent } from '../notifications/notifications.component';
import { Ng2Cable, Broadcaster } from 'ng2-cable';
import { CoworkingModel } from '../../core/models/coworking.model';
import { CreateCoworkingModel } from '../../core/models/createCoworking.model';
import { CheckboxModel } from '../../core/models/checkbox.model';
import { WorkingDayModel } from '../../core/models/workingDay.model';
import { TokenModel } from '../../core/models/token.model';
import { UserModel } from '../../core/models/user.model';
import { BookingModel } from "../../core/models/booking.model";
import { Base64ImageModel } from '../../core/models/base64image.model';
import { FrontWorkingDayModel } from 'app/core/models/frontWorkingDays.model';
import { BaseComponent } from 'app/core/base/base.component';

declare var jquery:any;
declare var $ :any;
declare var gapi :any;


@Component({
  selector: 'page-coworking',
  templateUrl: './pageCoworking.component.html'
})
export class CoworkingComponent extends BaseComponent implements OnInit {

  BookingErr = false;
  BookingOk = false;
  
  RegErrMsg = '';
  Coworking:CoworkingModel = new CoworkingModel();
  Days:FrontWorkingDayModel[] = [];
  AmetiesCB: CheckboxModel[] = []; 
  Me:UserModel = new UserModel();
  meRole:string = "guest";
  meCowork:number = 0;
  CoworkingId:number = 0;
  Images:Base64ImageModel[] = [];
  Image:string = '';
  Booking:BookingModel = new BookingModel();
  bsValue: Date = new Date();
  toTime:string = '11:00';
  fromTime:string = '10:00';
  minDate: Date;
  receptionSend:boolean = false;
  minTime:string = '00:00';
  maxTime:string = '23:59';
  showTime:boolean = false;
  errTime:boolean = true;
  ErrBookingMsg:string = "Incorrect Date or Time!";
  //pushNot:NotificationsComponent = new NotificationsComponent();
  constructor(protected service: MainService, protected router: Router, 
    private activatedRoute: ActivatedRoute, protected ng2cable: Ng2Cable, protected broadcaster: Broadcaster) {
    super(service,router,ng2cable,broadcaster);
  }

  
  ngOnInit() 
  {
    this.activatedRoute.params.forEach((params) => {
      this.CoworkingId = params["id"];
      this.GetCoworking(this.CoworkingId);
    });
    this.minDate = new Date();
   // this.minDate.setDate(this.minDate.getDate() - 1);
    this.Booking.begin_date = `2017-11-08T13:00`;
    this.Booking.end_date = `2017-11-08T15:00`;
    this.DateChange();
  }

  GetCoworking(id:number){

    this.WaitBeforeLoading(
      ()=> this.service.GetCoworkingById(id),
      (res:CoworkingModel)=>{
        this.Coworking = res;
        this.AmetiesCB = this.service.SetCheckedCB(this.service.GetAllAmenties(),res.amenties);
        if(this.Coworking.image_id){

          this.GetImageById(
            this.Coworking.image_id,
            (res:any)=>{
              if(res){
                this.Image = res.base64;
              }
            });
        }
        let current = 0,
            total = res.images.length;
        
        this.Days = this.service.GetFrontDaysByWorkingDays(this.Coworking.working_days);
        for(let item of res.images){
          this.GetImageById(
            item.id,
            (res:any)=>{
              if(res){
                this.Images.push(res);
                
              }
              current+=1;
              if(current == total){
                console.log("current"+ current);
                this.initSlider();
              }
            });
        }
        this.GetMyAccess(
          (res)=>{
              this.meCowork = res.coworking_id;
          }
        );
      },
      (err)=>{
        console.log(err);
      }
    );


  }



  getMask(){
    return {
        mask: [/[0-2]/, this.fromTime && parseInt(this.fromTime[0]) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
        keepCharPositions: true
      };
    } 

  getMaskEnd(){
    
    return {
        mask: [/[0-2]/, this.toTime && parseInt(this.toTime[0]) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
        keepCharPositions: true
      };
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
      this.addEventGoogleCalendar();
      this.router.navigate(['/my_bookings']);
      this.BookingOk = true;
      
    },
    (err)=>{
      console.log(`error = `,err);
      if(this.showTime){
        if(err._body==`{"begin_date":["INVALID"]}`) this.ErrBookingMsg = `In Start Time Coworking isn't work!`;
        if(err._body==`{"end_date":["INVALID"]}`) this.ErrBookingMsg = `In End Time Coworking isn't work!`;
        if(err._body==`{"capacity":["LIMIT_REACHED"]}`) this.ErrBookingMsg = `No available seats at this time!`;
      }
      else this.ErrBookingMsg = `In This Date Coworking isn't work!`;
      this.BookingErr = true;
      this.BookingOk = false;
  });
   
  }

  incr(n:number){
    return n+1;
  }
  
  initSlider(){

    setTimeout(function(){
      $('.slider-images-coworking-wr').slick({
        dots: true,
        arrows: true, 
        infinite: true, 
        speed: 300,
        slidesToShow: 1
    });

    },800);
    

  }
  receptionCoworking(){
    if(! this.receptionSend){
    
      this.service.RequestReception(this.Coworking.id)
      .subscribe((any)=>{
        console.log(`request send!`);
      });
    }

    this.receptionSend = true;
  }

  OnBeginWorkChanged($event:any){
    this.fromTime = $event;
    if(!this.toTime || 
        this.toTime < this.fromTime)
    {
        
        if(this.fromTime.indexOf("_") == -1){
          console.log('fromTime = '+this.fromTime.indexOf("_"));
            if(parseInt(this.fromTime[0]+this.fromTime[1]) <= 21 && parseInt(this.fromTime[3]+this.fromTime[4])<=59){
                let beginArr = this.fromTime.split(":");
                let endHour;
                if(+beginArr[0] <= 7){
                    let for_parse = parseInt(beginArr[0][1]);
                     endHour = '0'+(for_parse+1);
                }
                else{
                    endHour = +beginArr[0] + 1;
                }
                this.toTime = endHour+ ":" + beginArr[1];
                if(this.toTime>this.maxTime||this.toTime<this.minTime)this.errTime = true;
                else this.errTime = false;
            }
            else{
               
                this.toTime = "23:59"
                if(this.toTime>this.maxTime||this.toTime<this.minTime)this.errTime = true;
                else this.errTime = false;
            }
        }
       
    }
    if(this.fromTime.indexOf("_") != -1){
     
      this.errTime = true;
      
    }
    else{
      this.errTime = false;
    }
    

   
}

  OnEndWorkChanged($event:any){
    console.log('totime2 = '+this.toTime);
  // if(this.validateMinTime($event))
    this.toTime = $event;
 //   else this.toTime = this.maxTime;
 if(this.toTime.indexOf("_") != -1){
  this.errTime = true;
}
else{
  this.errTime = false;
}
    if(this.toTime>this.maxTime||this.toTime<this.minTime && this.toTime.indexOf("_") == -1)this.errTime = true;
    else this.errTime = false;
  
   
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
    console.log("showTime ="+this.showTime);
 
    if(this.Days && this.bsValue){
      let tmpDay = this.Days[ (this.bsValue.getDay()+6)%7];
      this.showTime = false;
      this.minTime = '00:00';
      this.maxTime = '00:00';
      if(tmpDay){
        for(let i of this.Coworking.working_days){
          if(tmpDay.en_name==i.day){
            this.showTime = true;
            this.toTime = '11:00';
            this.fromTime= '10:00';
            console.log("tmpDay = " +tmpDay)
            console.log("errTime ="+this.errTime);
            this.errTime = false;
            this.maxTime = i.end_work;
            this.minTime = i.begin_work;
            this.OnBeginWorkChanged(i.begin_work);
          }
        }
      }
    }
  }

  SendSMS(){
    this.service.SendSmsClickatell('380669643799','smsFrom SnollyPc');
    
  }


  addEventGoogleCalendar(){
    var clientId = '1097282523471-lm7pu51rn7i3ahqu7qf0h8a1dm94hsoj.apps.googleusercontent.com';
    var scopes = 'https://www.googleapis.com/auth/calendar';
    var start_date = this.Booking.begin_date;
    var end_date = this.Booking.end_date;
    var auth = gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false},  
       function(response) {
  
        gapi.client.load('calendar', 'v3', function() {
          /*
          console.log('-->',gapi.client.calendar);
          var request = gapi.client.calendar.calendarList.list();
          request.execute(function(resp){
            $.each( resp.items, function( key, value ) {
              console.log(resp.items[key].id);
            });
          });
          var request1 = gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': '2015-12-23T04:26:52.000Z'//Suppose that you want get data after 23 Dec 2014
          });
          request1.execute(function(resp){
            $.each( resp.items, function( key, value ) {
              console.log(resp.items[key]);// here you give all events from google calendar
            });
          });
        */
      // var offset = new Date().getTimezoneOffset()/60;
        //console.log(`timezone`,offset);
    
          var event = {
            'summary': 'D4W Start',
                    'description': 'You are booking work place!',
            'start': {
              'dateTime': start_date+":00",
              'timeZone':'Europe/Moscow' 
            },
            'end': {
              'dateTime': end_date+":00",
              'timeZone':'Europe/Moscow'
            },
            
            'reminders': {
              'useDefault': false,
              'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 30}
              ]
            }
          };
          console.log(`event = `,event);
          var request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
          });
          
          request.execute(function(event) {
            console.log('Event created: ' + event.htmlLink);
          });
        });
      } 
    );    
  }

}


