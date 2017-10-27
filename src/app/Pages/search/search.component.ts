import { Component,OnInit,NgModule }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { HttpService } from '../../services/http.service';

import { MainService } from "./../../services/main.service";
import { ActivityModel } from '../../models/activity.model';
import { UserModel } from '../../models/user.model';
import { Base64ImageModel } from '../../models/base64image.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { NgForm} from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { CategoryModel } from '../../models/category.model';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { ViewChild, ElementRef, NgZone } from '@angular/core';

@Component({
    moduleId:module.id,
    selector: "search",
    templateUrl: "./search.component.html",
    providers: [HttpService]
})

export class SearchComponent implements OnInit {
    isLoading = true;
    Activities: ActivityModel[] = [];
    Users: UserModel[] = [];
    Images: string[] = [];
    Start:Date;
    Finish:Date;
    Params = {
        title: '',
        description: '',
        public_lat:null,
        public_lng:null,
        from_date:null,
        to_date:null,
        user_id: '',
        radius: 15,
        category: '',
        sub_category: ''
    }
    lat:number = 48.8916733;
    lng:number = 2.3016161;
    isAdvanced:boolean = false;
    bsConfig:Partial<BsDatepickerConfig>;
    Categories:CategoryModel[] = [];
    lengthShortName:number = 6;
    isMapFixed:boolean = false;
    hSize:number=100;
    wSize:number=100;
    hCards:number=100;
    mapBut:boolean = false;
    showDP:boolean = false;
    
    _bsRangeValue: any = [this.prevWeek(new Date()), this.nextWeek(new Date())];
    get bsRangeValue(): any {
      return this._bsRangeValue;
    }
   
    set bsRangeValue(v: any) {
      this._bsRangeValue = v;
    }

    @ViewChild('searchg') public searchElement: ElementRef;

    constructor(private router: Router,
        private service: MainService,
        private params: ActivatedRoute,
        private _sanitizer: DomSanitizer,
        private mapsAPILoader: MapsAPILoader, 
        private ngZone: NgZone){}

    ngOnInit(){

        window.scrollTo(0, 0);
        
        this.bsConfig = Object.assign({}, {containerClass: 'theme-default',showWeekNumbers:false});
        this.service.GetMe()
            .subscribe((res:UserModel)=>{
                this.lat = res.lat;
                this.lng = res.lng;
            })
        this.Categories = this.service.GetAllCategoriesAsArrayCategory();    
        this.CreateAutocompleteMap();
        this.GetAllActivities();
        
        
        // высота и ширина карты
        this.hSize = document.documentElement.clientHeight-25;
        this.wSize = (document.getElementById("card_div").clientWidth-50)*0.8;

        window.addEventListener(`scroll`, (e) => {

            if (window.pageYOffset > 320 && this.hSize <  document.getElementById("card_div").clientHeight) {

                if(window.pageYOffset+this.hSize>document.documentElement.scrollHeight-253)
               {
                this.mapBut = true;
                this.isMapFixed = false;
               }
                else{ 
                    this.mapBut = false;
                    this.isMapFixed = true;
                }
            } else {
                this.mapBut = false;
                this.isMapFixed = false;
            }
            
        });

        console.log(`card_div = `,this.wSize);

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
                this.Params.public_lat=autocomplete.getPlace().geometry.location.toJSON().lat;
                this.Params.public_lng=autocomplete.getPlace().geometry.location.toJSON().lng;
                this.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                this.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
               }
              });
              });
            }
               );


    }


    mapClicked($event: any) {
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;

        console.log("coords");
        console.log(this.lat);
        console.log(this.lng);
 
      }

      GetAllActivities(){
        this.isLoading = true;

        this.Params.from_date = this.bsRangeValue[0];
        this.Params.to_date = this.bsRangeValue[1];

        console.log(this.Params);
   
        this.service.GetAllActivities(this.Params)
        .subscribe((res:ActivityModel[])=>{
            console.log(res);
            let activ:ActivityModel[] = res;
            for(let item of activ){
                if(item.image_id){
                    this.service.GetImageById(item.image_id)
                        .subscribe((image:Base64ImageModel)=>{
                            this.Images['act'+item.id]=image.base64;
                            
                        })
                }
                this.service.GetUserById(item.user_id)
                    .subscribe((user:UserModel)=>{
                        this.Users[item.user_id] = user;
                        if(user.image_id){
                            this.service.GetImageById(user.image_id)
                                .subscribe((img:Base64ImageModel)=>{
                                    this.Images['user'+item.user_id]=img.base64;
                                })
                        }
                    })
                   
            } 
            this.ActivityRev(activ);

            this.isLoading = false;
        });
       
    }
    ActivityRev(act:ActivityModel[]){
        this.Activities = [];
        
        for(let item of act) if(item.user_name&&item.title)this.Activities.push(item);

        if(this.Activities.length>0){
        this.lat = this.Activities[0].public_lat;
        this.lng = this.Activities[0].public_lng;
        }
        
      
    }

    FromDateChanged($event){
        let date:Date = new Date($event);
        if(date){
            console.log($event);
            this.Params.from_date = $event;
        }
    }
    autocompleListFormatter = (data: CategoryModel) : SafeHtml => {
        console.log(`autocompleListFormatter`);
        let html =  `<span><b>${data.name}</b></span>`;
        if(data.parent)html = `<span>${data.parent} : <b>${data.name}</b></span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    }
    CategoryChanged($event:CategoryModel){
        if($event.parent){
        this.Params.category = $event.parent?$event.parent:$event.value;
        this.Params.sub_category = $event.parent?$event.value:null;}
        else {
            this.Params.category = "";
            this.Params.sub_category = "";
        }
        console.log(this.Params);
    }
    markerClick(item:ActivityModel){
            console.log(`click`,item.id);
            this.router.navigate(['/activity/',item.id]);
    }

    getShortNames(name:string){
        return this.service.GetShortName(name,this.lengthShortName);
    }


    change_coords(i:number){
        if(i%3==0)i=-i;
        if(i%2==0)return 0.001*(i%20);
        else return -0.001*(i%20);
    }

    prevWeek(date:Date){
        let previousDay = new Date(date);
        previousDay.setDate(date.getDate()-10);
        return previousDay;
    }
    nextWeek(date:Date){
        let nextDay = new Date(date);
        nextDay.setDate(date.getDate()+10);
        return nextDay;
    }
   
    
}