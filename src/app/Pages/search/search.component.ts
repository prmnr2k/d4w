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
        address: '',
        from_date:null,
        to_date:null,
        user_id: '',
        radius: null
    }
    lat:number = 48.8916733;
    lng:number = 2.3016161;
    isAdvanced:boolean = false;
    bsConfig:Partial<BsDatepickerConfig>;
    constructor(private router: Router,
        private service: MainService,
        private params: ActivatedRoute){}

    ngOnInit(){
        this.bsConfig = Object.assign({}, {containerClass: 'theme-default',showWeekNumbers:false});
        this.service.GetMe()
            .subscribe((res:UserModel)=>{
                this.lat = res.lat;
                this.lng = res.lng;
            })
        this.GetAllActivities();
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
        console.log(this.Params);
        this.service.GetAllActivities(this.Params)
        .subscribe((res:ActivityModel[])=>{
            console.log(res);
            this.Activities = res;
            for(let item of this.Activities){
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

    FromDateChanged($event){
        let date:Date = new Date($event);
        if(date){
            console.log($event);
            this.Params.from_date = $event;
        }
    }

    observableSource = (keyword: any) :Observable<any[]> => {
        if(keyword){
            return this.service.GetAddrFromGoogle(keyword);
        }
        else{
            return Observable.of([]);
        }
    }
    AddressChanged($event){
        console.log($event);
        if($event.formatted_address){
            this.Params.address = $event.formatted_address;
            if($event.geometry && $event.geometry.location){
                this.lat = $event.geometry.location.lat;
                this.lng = $event.geometry.location.lng;
            }
        }
        else $event = "";
    }

}