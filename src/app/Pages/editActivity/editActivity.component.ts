import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
import { ActivityModel } from '../../models/activity.model';
import { CreateActivityModel } from '../../models/createActivity.model';
import { Base64ImageModel } from '../../models/base64image.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { UserModel } from '../../models/user.model';
import { Observable } from 'rxjs/Rx';
import { CategoryModel } from '../../models/category.model';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { ViewChild, ElementRef, NgZone } from '@angular/core';

@Component({
    moduleId:module.id,
    selector: 'editActivity',
    templateUrl: './editActivity.component.html',
    providers: [HttpService]
})

export class EditActivityComponent implements OnInit {
    Activity:CreateActivityModel = new CreateActivityModel();
    Start:Date = new Date();
    Finish:Date = new Date();
    isLoading = true;
    actId = 0;
    bsConfig:Partial<BsDatepickerConfig>;
    Categories: CategoryModel[] =[];
    MyCategory:CategoryModel = new CategoryModel();
    ErrMsg = '';
    isEditErr = false;

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
        this.isLoading = true;

       
        this.activatedRoute.params.forEach((params:Params) => {
            this.actId = params["id"];
            this.Categories = this.service.GetCategoriesAsArrayCategory();
            this.service.GetActivity(this.actId)
                .subscribe((act:ActivityModel)=>{
                    this.AfterGettingActivity(act);
                })
            this.service.GetMe()
                .subscribe((res:UserModel)=>{
                    this.Activity.public_lat = res.lat;
                    this.Activity.public_lng = res.lng;
                    this.Activity.lat = res.lat;
                    this.Activity.lng = res.lng;
                })
        });
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
                this.Activity.public_lat  = autocomplete.getPlace().geometry.location.toJSON().lat;
                this.Activity.public_lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                this.Activity.address = autocomplete.getPlace().formatted_address;
               }
              });
              });
            }
               );


    }
    AfterGettingActivity(act:ActivityModel){
        this.Activity = this.service.ActivityModelToCreateActivityModel(act);
        if(this.Activity.sub_category){
            this.MyCategory = this.Categories.find(obj=>obj.value == this.Activity.sub_category);
        }
        if(act.image_id)
        {
            this.service.GetImageById(act.image_id)
                .subscribe((res:Base64ImageModel)=>{
                    this.Activity.image = res.base64;
                })
        }
        this.Start = this.Activity.calendar[0];
        this.Finish = this.Activity.calendar[1]?this.Activity.calendar[1] : new Date();
        this.isLoading = false;
    }
    OnEditActivityButtonClick()
    {
        scrollTo(0,0);
        this.isLoading = true;
        this.isEditErr = false;
        if(!this.CheckActivity()){
            this.isEditErr = true;
            this.isLoading = false;
            return;
        }
        this.service.UpdateActivity(this.actId,this.Activity)
        .subscribe((res:ActivityModel)=>{
            this.router.navigate(['/activity',res.id]);
            /*console.log(res);
            this.AfterGettingActivity(res);*/
        },
    (err:any)=>{
        this.ErrMsg = err.body;
        this.isEditErr = true;
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
    }
    NewDate(){
        this.Activity.calendar.push(new Date());
    }
    DeleteDate(index:number){
        this.Activity.calendar.splice(index,1);
    }

    

    autocompleListFormatter = (data: CategoryModel) : SafeHtml => {
        let html = `<span>${data.parent} : <b>${data.name}</b></span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    }
    CategoryChanged($event:CategoryModel){
        this.MyCategory = $event;
        console.log(this.MyCategory);
        this.Activity.category = this.MyCategory.parent;
        this.Activity.sub_category = this.MyCategory.value;
        console.log(this.Activity);
    }

    CheckActivity():boolean{
        //this.ErrMsg = "Input correct data: "
        this.ErrMsg = "Fill in all fields"
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
            return false;
        }

        if(!this.Activity.num_of_bookings || this.Activity.num_of_bookings < 0 || this.Activity.num_of_bookings > 10000){
            /*if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Number of possible bookings per day";*/
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
}