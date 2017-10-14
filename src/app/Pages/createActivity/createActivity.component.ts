import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
import { ActivityModel } from '../../models/activity.model';
import { CreateActivityModel } from '../../models/createActivity.model';
import { UserModel } from '../../models/user.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CheckboxModel } from '../../models/checkbox.model';
import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { CategoryModel } from '../../models/category.model';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { ViewChild, ElementRef, NgZone } from '@angular/core';

@Component({
    moduleId:module.id,
    selector: 'createActivity',
    templateUrl: './createActivity.component.html',
    providers: [HttpService]
})

export class CreateActivityComponent implements OnInit {
    Activity:CreateActivityModel = new CreateActivityModel();
    lastChangeClnd:number=null;
    Start:Date = new Date();
    Finish:Date = new Date();
    Today:Date = new Date();
    isLoading = false;
    isCreateErr = false;
    ErrMsg = '';
    bsConfig:Partial<BsDatepickerConfig>;
    Categories: CategoryModel[] =[];
    mapLat:number;
    mapLng:number;
    
    @ViewChild('searchg') public searchElement: ElementRef;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private service: MainService,
        private _sanitizer: DomSanitizer,
        private mapsAPILoader: MapsAPILoader, 
        private ngZone: NgZone)
    {
    }
    ngOnInit() {
        this.bsConfig = Object.assign({}, {containerClass: 'theme-default',showWeekNumbers:false});
        this.Activity.calendar = [];
        this.NewDate();
        this.Categories = this.service.GetCategoriesAsArrayCategory();
        this.service.GetMe()
            .subscribe((res:UserModel)=>{
                this.mapLat = 48.8916733;
                this.mapLng = 2.3016161;
                this.Activity.lat = 48.8916733;
                this.Activity.lng = 2.3016161;
                this.Activity.public_lat = 48.8916733;
                this.Activity.public_lng = 2.3016161;
                if(res.lat && res.lng){
                    this.Activity.lat = res.lat;
                    this.Activity.lng = res.lng;
                    this.Activity.public_lat = res.lat;
                    this.Activity.public_lng = res.lng;
                    this.mapLat = res.lat;
                    this.mapLng = res.lng;
                }
            })
            this.CreateAutocompleteMap();
    }
    CreateAutocompleteMap(){
        this.mapsAPILoader.load().then(
            () => {
             let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {types:[`(cities)`]});
             console.log(autocomplete);
              autocomplete.addListener("place_changed", () => {
               this.ngZone.run(() => {
               let place: google.maps.places.PlaceResult = autocomplete.getPlace();  
               if(place.geometry === undefined || place.geometry === null ){
                return;
               }
               else {
                this.mapLat = autocomplete.getPlace().geometry.location.toJSON().lat;
                this.mapLng = autocomplete.getPlace().geometry.location.toJSON().lng;
                this.Activity.lat = this.mapLat;
                this.Activity.lng = this.mapLng;
                this.Activity.address = autocomplete.getPlace().formatted_address;
               }
              });
              });
            }
               );


    }

    CheckActivity():boolean{
        //this.ErrMsg = "Input correct data: "
        this.ErrMsg = "Fill in all fields";
        let len = this.ErrMsg.length + 1;
        this.ErrMsg += "!";
        if(!this.Activity.title){
            //this.ErrMsg += "Title"
            return false;
        }

        if(!this.Activity.image){
            /*if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Picture";*/
            return false;
        }

        if(!this.Activity.price || this.Activity.price < 0 || this.Activity.price > 100000){
            /*if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Price";*/
            this.ErrMsg = "Uncorrect price!";
            return false;
        }

        if(!this.Activity.num_of_bookings || this.Activity.num_of_bookings < 0 || this.Activity.num_of_bookings > 10000){
            /*if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Number of possible bookings per day";*/
            this.ErrMsg = "Uncorrect number of possible bookings!";
            return false;
        }

        if(!this.Activity.address){
           /* if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Address";*/
            return false;
        }

        if(!this.Activity.detailed_address){
            /*if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Detailed address";*/
            return false;
        }

        if(!this.Activity.description){
            /*if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Description";*/
            return false;
        }

        if(!this.Activity.lat && !this.Activity.lng){
            /*if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Mark on the map";*/
            return false;
        }
        //this.ErrMsg += "!";
        return this.ErrMsg.length == len;
    }
    OnCreateActivityButtonClick()
    {
        this.isLoading = true;
        this.isCreateErr = false;
        scrollTo(0,0);
        if(!this.CheckActivity()){
            this.isCreateErr = true;
            this.isLoading = false;
            return;
        }
        console.log(this.Activity);
        this.service.CreateActivity(this.Activity)
        .subscribe((res:ActivityModel)=>{
            this.router.navigate(['/activity',res.id]);
        },
        (err:any)=>{
            this.ErrMsg = err.body;
            this.isCreateErr = true;
            this.isLoading=false;
        });
    }
    changeListener($event: any) : void {
        this.readThis($event.target);
    }

    readThis(inputValue: any): void {
        let file:File = inputValue.files[0];
        if(!file) return;
        let myReader:FileReader = new FileReader();
        myReader.onloadend = (e) => {
                this.Activity.image = myReader.result;
        }
        myReader.readAsDataURL(file);
    }

    mapClicked($event: any) {
        this.Activity.lat = $event.coords.lat;
        this.Activity.lng = $event.coords.lng;
        console.log(`mapClick`);
        console.log(this.Activity.lat, this.Activity.lng);
    }
    mapMarkerDrag($event:any){
        this.Activity.lat = $event.coords.lat;
        this.Activity.lng = $event.coords.lng;
        console.log(`markerDrag`);
        console.log(this.Activity.lat, this.Activity.lng);
    }

    NewDate(){
        this.Activity.calendar.push(new Date());
        
    }
    DeleteDate(index:number){
        this.Activity.calendar.splice(index,1);
    }

    ActivityCalendarChanged(index:number, date:Date){     
        this.Activity.calendar[index] = date;
        console.log('calendar', this.Activity.calendar);
    }

    ChangeBookings(elem){
        /*if(elem.value > 10000)
            elem.value = 10000;*/
        this.Activity.num_of_bookings = elem.value;
    }
/*
    observableSource = (keyword: any) :Observable<any[]> => {
        if(keyword){
            return this.service.GetAddrFromGoogle(keyword);
        }
        else{
            return Observable.of([]);
        }
    }
    AddressChanged($event){
        if($event.formatted_address){
            this.Activity.address = $event.formatted_address;
            if($event.geometry && $event.geometry.location){
                this.Activity.lat = $event.geometry.location.lat;
                this.Activity.lng = $event.geometry.location.lng;
                this.mapLat =  $event.geometry.location.lat;
                this.mapLng =  $event.geometry.location.lng;
                
                console.log(`addressChange`);
                console.log(this.Activity.lat, this.Activity.lng);

            }
        }
        else $event = "";
    }*/

    autocompleListFormatter = (data: CategoryModel) : SafeHtml => {
        let html = `<span>${data.parent} : <b>${data.name}</b></span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    }
    CategoryChanged($event:CategoryModel){
        this.Activity.category = $event.parent;
        this.Activity.sub_category = $event.value;
        console.log(this.Activity);
    }


   
}
