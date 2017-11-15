import { Component, OnInit } from '@angular/core';

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
  showNotification(text, from, align){
      const type = ['','info','success','warning','danger'];

      var color = Math.floor((Math.random() * 4) + 1);
      $.notify({
          icon: "pe-7s-gift",
          message: text
      },{
          type: //type[color], 
          'info',
          timer: 5000,
          placement: {
              from: from,
              align: align
          }
      });
     // this.sound.play();
  }
}
