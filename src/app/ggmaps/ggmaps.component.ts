import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ggmaps',
  templateUrl: './ggmaps.component.html',
  styleUrls: ['./ggmaps.component.scss']
})
export class GgmapsComponent implements OnInit {

  constructor() { }
   
  lat: number = 55.751244;
  lng: number = 37.618423;

  ngOnInit() {
  }
  
}
