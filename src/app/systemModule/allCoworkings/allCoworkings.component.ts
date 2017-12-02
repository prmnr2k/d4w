import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { MainService } from '../../core/services/main.service';
import { Router, Params } from '@angular/router';
import { CoworkingModel } from '../../core/models/coworking.model';
import { CreateCoworkingModel } from '../../core/models/createCoworking.model';
import { CheckboxModel } from '../../core/models/checkbox.model';
import { WorkingDayModel } from '../../core/models/workingDay.model';
import { TokenModel } from '../../core/models/token.model';
import { UserModel } from '../../core/models/user.model';
import { Base64ImageModel } from '../../core/models/base64image.model';


import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

import { Ng2Cable, Broadcaster } from 'ng2-cable';
import { BaseComponent } from '../../core/base/base.component';
import { FrontWorkingDayModel } from 'app/core/models/frontWorkingDays.model';

import {} from '@types/googlemaps';
import { ShowHideTrigger } from 'app/shared/animations/showFade.animation';


declare var google: any;

@Component({
  selector: 'all-coworkings',
  templateUrl: './allCoworkings.component.html',
  styleUrls:["./allCoworkings.component.css"],
  animations:[
    ShowHideTrigger
  ]
})

export class AllCoworkingsComponent extends BaseComponent implements OnInit{
  RegistrationErr = false;
  Coworkings:CoworkingModel[] = [];
  Images:string[] = [];
  bsRangeValue:any;
  Page: number=1;
 // Pages: number[] = [];

  @ViewChild('searchg') public searchElement: ElementRef;

  Params = {
    limit:20,
    offset:0,
    description:'',
    full_name:'',
    address:'',
    additional_info:'',
    begin_work:'',
    end_work:'',
    lat:null,
    lng:null,
    working_days: [],
    begin_date:'',
    end_date:'',
    //date:null
  };
  Working_days:FrontWorkingDayModel[] = [];
  constructor(protected service: MainService, protected router: Router,
    private mapsAPILoader: MapsAPILoader, 
    private ngZone: NgZone, 
    protected ng2cable: Ng2Cable, protected broadcaster: Broadcaster) {
    super(service,router,ng2cable,broadcaster);
}


  ngOnInit() 
  {
    this.CreateAutocompleteMap();
    this.Working_days = this.service.GetAllDays();
    this.CoworkingSearch(true);
  }

  getMask(){
    return {
      mask: [/[0-2]/, this.Params.begin_work && parseInt(this.Params.begin_work[0]) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
      keepCharPositions: true
    };
  } 


  getMaskEnd(){
    return {
      mask: [/[0-2]/, this.Params.end_work && parseInt(this.Params.end_work[0]) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
      keepCharPositions: true
    };
  } 

  CreateAutocompleteMap(){
    this.mapsAPILoader.load().then(
        () => {
           
         let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {types:[`(cities)`]});
        
          autocomplete.addListener("place_changed", () => {
           this.ngZone.run(() => {
           let place: google.maps.places.PlaceResult = autocomplete.getPlace();  
           if(place.geometry === undefined || place.geometry === null ){
            
            return;
           }
           else {
            //this.Params.address = autocomplete.getPlace().formatted_address;
           
           // this.Params.public_lat=autocomplete.getPlace().geometry.location.toJSON().lat;
           // this.Params.public_lng=autocomplete.getPlace().geometry.location.toJSON().lng;
           // this.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
            //this.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
            console.log( autocomplete.getPlace().geometry.location.toJSON().lat, autocomplete.getPlace().geometry.location.toJSON().lng);
            this.Params.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
            this.Params.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
           }
          });
          });
        }
           );


}


  OnBeginWorkChanged($event:any){
    this.Params.begin_work = $event
  }
  OnEndWorkChanged($event:any){
    this.Params.end_work = $event
  }

  setDate(date?:Date){
    this.Params.begin_date = this.bsRangeValue[0].getDate()+'.'+(this.bsRangeValue[0].getMonth()+1)+'.'+this.bsRangeValue[0].getFullYear();
    this.Params.end_date = this.bsRangeValue[1].getDate()+'.'+(this.bsRangeValue[1].getMonth()+1)+'.'+this.bsRangeValue[1].getFullYear();
  }


  CoworkingSearch(params?:boolean) {

    if(this.searchElement.nativeElement.value==""||!this.searchElement.nativeElement.value){
      //console.log(`NO address`);
      this.Params.lat = null;
      this.Params.lng = null;
      this.Params.limit = 20;
      }

    if(params){
      this.Params.working_days = this.service.GetCheckedWorkingDaysName(this.Working_days);
    }

    this.Params.limit = 12;
    this.Params.offset = (this.Page - 1)*12;

    this.WaitBeforeLoading(
      ()=>this.service.GetAllCoworking(params?this.Params:null),
      (res:any)=>{
        this.Coworkings = res;
        if(this.Coworkings.length == 0)
          return;
        /*
        let i = 0;
        this.Pages = [];
        while(i<res.total_count){
            this.Pages.push(i/10+1);
            i+=10;
        }
        if(this.Pages.length == 1)this.Pages = [];
        */
        this.getCoworkingsImg();
    },
    (err)=>{
      console.log(err);
    });
  }

  

  getCoworkingsImg(){
    this.Images = [];
    for(let item of this.Coworkings)
    {
     if( item.images && item.images[0] && item.images[0].id){
        this.GetImageById(item.images[0].id?item.images[0].id:null,(img:Base64ImageModel)=>{
          this.Images[item.id] = img.base64;
        },(err)=>{ this.Images[item.id] = null; });
      } else this.Images[item.id] = null; 
  
  }
}


  SetPoint($event) {
    if($event && $event.coords){
      this.Params.lat = $event.coords.lat;
      this.Params.lng = $event.coords.lng;
    }

  }


    DeleteCoords(){
      this.Params.lat = null;
      this.Params.lng = null;
      console.log(this.Params);
    }

    ChangePageNumber(page:number){
      
      this.Page = page;
      this.CoworkingSearch(true);
  }
  PrevOrNextPage(next:boolean)
  {
      this.Page += next?1:-1;
      this.CoworkingSearch(true);
  }

}

