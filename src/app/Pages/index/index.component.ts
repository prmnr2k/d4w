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
    
    bsConfig:Partial<BsDatepickerConfig>;
    Params = {
        limit:4,
        title: '',
        address: '',
        from_date:null
    }
    ParamsSearch = {
        title: ``,
        address: ``,
        from_date:``
    }
    constructor(private router: Router,
        private service: MainService,
        private params: ActivatedRoute){}


    ngOnInit() {
        this.bsConfig = Object.assign({}, {containerClass: 'theme-default',showWeekNumbers:false});
        this.GetFourActivities();
        
    }
    GetFourActivities(){
        this.isLoading = true;
        this.Params.from_date = new Date();
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

    openSearch(){
       console.log(`search`);
       this.router.navigate(['/discover',{address:this.ParamsSearch.address,title:this.ParamsSearch.title,from_date:this.ParamsSearch.from_date}]);
    }
}