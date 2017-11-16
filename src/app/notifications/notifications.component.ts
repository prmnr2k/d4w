import { Component, OnInit } from '@angular/core';
import { HttpService } from '../core/services/http.service';
import { MainService } from '../core/services/main.service';
declare var $:any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  sound = new Audio();
  constructor() {
    this.sound.src = "https://wav-library.net/sounds/0-0-1-17733-20";
    this.sound.load();

  }

  ngOnInit() {
  }
  showNotification(text, from, align,user_id?){
      const type = ['','info','success','warning','danger'];
      var color = Math.floor((Math.random() * 1000) + 1);
      $.notify({
          icon: "pe-7s-gift",
          message: text
      },{
          type: //type[color], 
          'info',
          timer: 15000,
          placement: {
              from: from,
              align: align
          }
      });

      if(text=='Booking started 10 min ago!<button type="button" id="id-but" class="form-control" class="btn btn-info btn-fill" (click)="SendSMS()">Send SMS to User</button>')
      document.getElementById('id-but').onclick = function(){
        console.log(`old send Сlickatell`);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://platform.clickatell.com/messages/http/send?apiKey=2SrHPOF5S9Ws8QHc5oUG5g==&to="+`380669643799`+"&content="+`You are late to cwrk! d4w`, true);
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 && xhr.status == 200){
                console.log('success')
            }
        };
        xhr.send();
        document.getElementById('id-but').style.color='red';
        document.getElementById('id-but').setAttribute("disabled","disabled");
      };
      this.sound.play();
  }

  SendSMS(){
   
    console.log(`send sms`);
   // this.service.SendSmsClickatell('380669643799','smsFrom SnollyPc v777');
  }
}















