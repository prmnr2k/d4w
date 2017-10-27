import { Component,OnInit,NgModule }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RouterModule } from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
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
    selector: "index",
    templateUrl: "./index.component.html",
    providers: [HttpService]
})

export class IndexComponent implements OnInit{
    isLoading = true;
    Activities: ActivityModel[] = [];
    Users: UserModel[] = [];
    Images: string[] = [];
    lengthShortName:number = 6;
    bsConfig:Partial<BsDatepickerConfig>;
    Params = {
        limit:4,
        title: '',
        address: '',
        from_date:null
    }
    ParamsSearch = {
        address: '',
        category: '',
        sub_category: '',
        from_date:'',
        to_date:''
    }
    Categories:CategoryModel[] = [];
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


    ngOnInit() {
        this.bsConfig = Object.assign({}, {containerClass: 'theme-default',showWeekNumbers:false});
        this.Categories = this.service.GetAllCategoriesAsArrayCategory();
        this.CreateAutocompleteMap();
        this.GetFourActivities();
        
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
                   this.ParamsSearch.address = autocomplete.getPlace().formatted_address;
               }
              });
              });
            }
               );


    }
    GetFourActivities(){
        this.isLoading = true;
        this.Params.from_date = new Date();
        console.log(this.Params);
        this.service.GetAllActivities(this.Params)
        .subscribe((res:ActivityModel[])=>{
            console.log(res);
            this.Activities = res;
            //this.getShortNames();
            for(let item of this.Activities){
                //this.getShortNames(item.user_name);
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
            this.isLoading = false;
        });
    }

    getShortNames(name:string){
        return this.service.GetShortName(name,this.lengthShortName);
    }

    openSearch(){
       console.log(`search`);
       this.ParamsSearch.from_date = this.bsRangeValue[0];
       this.ParamsSearch.to_date = this.bsRangeValue[1];
       this.router.navigate(['/discover',this.ParamsSearch]);
    }

    observableSource = (keyword: any) :Observable<any[]> => {
        if(keyword){
            return this.service.GetAddr(keyword);
        }
        else{
            return Observable.of([]);
        }
    }
    AddressChanged($event){
        if($event.formatted_address){
            this.ParamsSearch.address = $event.formatted_address;
        }
        else $event = "";
    }

    autocompleListFormatter = (data: CategoryModel) : SafeHtml => {
        let html =  `<span><b>${data.name}</b></span>`;
        if(data.parent)html = `<span>${data.parent} : <b>${data.name}</b></span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    }
    CategoryChanged($event:CategoryModel){
        this.ParamsSearch.category = $event.parent?$event.parent:$event.value;
        this.ParamsSearch.sub_category = $event.parent?$event.value:'';
        console.log(this.Params);
    }
    nextWeek(date:Date){
        let nextDay = new Date(date);
        nextDay.setDate(date.getDate()+10);
        return nextDay;
    }
    prevWeek(date:Date){
        let nextDay = new Date(date);
        nextDay.setDate(date.getDate()-10);
        return nextDay;
    }
}