import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RouterModule} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import { ActivityModel } from '../../models/activity.model';
import { MainService } from '../../services/main.service';
import { UserModel } from '../../models/user.model';
import { Base64ImageModel } from '../../models/base64image.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Observable } from 'rxjs/Rx';
import { CategoryModel } from '../../models/category.model';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { ViewChild, ElementRef, NgZone } from '@angular/core';

@Component({
    moduleId:module.id,
    selector: "discover",
    templateUrl: "./discover.component.html",
    providers: [HttpService]
})

export class DiscoverComponent implements OnInit{
    isLoading = true;
    Activities: ActivityModel[] = [];
    Users:UserModel[] = [];
    Images:string[] = [];
    Start:Date;
    Finish:Date;
    Params = {
        limit:100,
        offset:0,
        address:'',
        from_date:null,
        to_date:null,
        title:'',
        description:'',
        category: '',
        sub_category: ''
    };
    bsConfig:Partial<BsDatepickerConfig>;
    Categories:CategoryModel[] = [];
    MyCategory: CategoryModel = new CategoryModel();
    lengthShortName:number = 5;
    //lat:number = 48.8916733;
    //lng:number = 2.3016161;

    @ViewChild('searchg') public searchElement: ElementRef;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private service: MainService,
        private params: ActivatedRoute,
        private _sanitizer: DomSanitizer,
        private mapsAPILoader: MapsAPILoader, 
        private ngZone: NgZone){}

    ngOnInit(){
        window.scrollTo(0, 0);
        /*
        this.service.GetMe()
        .subscribe((res:UserModel)=>{
            if(res.lat&&res.lng){
                this.lat = res.lat;
                this.lng = res.lng;
                }
        });*/

        this.bsConfig = Object.assign({}, {containerClass: 'theme-default',showWeekNumbers:false});
        let sub:any = this.route.params.subscribe(params => {
            //this.Params.limit = +params['limit']; // (+) converts string 'id' to a number
            if(params['address'])
                this.Params.address = params['address'];
            else 
                this.Params.address = '';
            if(params['title'])
                this.Params.title = params['title'];
            else 
                this.Params.title = '';
            if(params['from_date'])
                this.Params.from_date = params['from_date'];
            else 
                this.Params.from_date = null;
            if(params['category'])
                this.Params.category = params['category'];
            else 
                this.Params.category = '';
            if(params['sub_category'])
                this.Params.sub_category = params['sub_category'];
            else 
                this.Params.sub_category = '';

            console.log(this.Params);
            
            this.Categories = this.service.GetAllCategoriesAsArrayCategory();

            if(this.Params.category || this.Params.sub_category){
                this.MyCategory = this.Categories.find(obj=>obj.value == (this.Params.sub_category?this.Params.sub_category : this.Params.category));
            }
        });
        this.CreateAutocompleteMap();
        this.GetAllActivities();
        
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
                   this.Params.address = autocomplete.getPlace().formatted_address;
               }
              });
              });
            }
               );
    }

    GetAllActivities(){
        this.isLoading = true;
        
        //this.Params.dates = [this.Start, this.Finish];
        console.log(this.Params);
        this.service.GetAllActivities(this.Params)
        .subscribe((res:ActivityModel[])=>{
            let activ:ActivityModel[] = res;
            /*if(res.length>0){
                this.lat = res[0].public_lat;
                this.lng = res[0].public_lng;
                }
                else{
                    this.lat = 48.8916733;
                    this.lng = 2.3016161;
                }*/
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
        },
    (err:any)=>{
        this.SomeErr(err);
    });

    
}

    ActivityRev(act:ActivityModel[]){
        this.Activities = [];
        for(let item of act) if(item.user_name&&item.title)this.Activities.push(item);
    }
    
    FromDateChanged($event){
        let date:Date = new Date($event);
        if(date){
            console.log($event);
            this.Params.from_date = $event;
        }
    }
    SomeErr(err:any){
    }




    autocompleListFormatter = (data: CategoryModel) : SafeHtml => {
        let html =  `<span><b>${data.name}</b></span>`;
        if(data.parent)
            html = `<span>${data.parent} : <b>${data.name}</b></span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    }
    CategoryChanged($event:CategoryModel){
        if($event.parent){
        this.Params.category = $event.parent?$event.parent:$event.value;
        this.Params.sub_category = $event.parent?$event.value:null;}
        else {
            this.Params.category = "";
            this.Params.sub_category = "";}
        
        console.log(this.Params);
    }
    getShortNames(name:string){
        return this.service.GetShortName(name,this.lengthShortName);
    }
    markerClick(item:ActivityModel){
        console.log(`click`,item.id);
        this.router.navigate(['/activity/',item.id]);
}
}