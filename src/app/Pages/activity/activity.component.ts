import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RouterModule } from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';


import {MainService} from "./../../services/main.service";
import { ActivityModel } from '../../models/activity.model';
import { UserModel } from '../../models/user.model';
import { Base64ImageModel } from '../../models/base64image.model';

@Component({
    moduleId:module.id,
    selector: "activity",
    templateUrl: "./activity.component.html",
    providers: [HttpService]
})

export class ActivityComponent implements OnInit{
    isLoading = true;
    Activity: ActivityModel = new ActivityModel();
    ActivityImg:string;
    User:UserModel = new UserModel();
    Start:Date = new Date();
    UserLogo:string = '';
    constructor(private router: Router,
        private service: MainService,
        private activatedRoute: ActivatedRoute){}

    ngOnInit(){
        console.log(this.Start);
         this.activatedRoute.params.forEach((params:Params) => {
             this.isLoading = true;
            let actId= params["id"];
            console.log(actId);
            this.service.GetActivity(actId)
                .subscribe((act:ActivityModel)=>{
                    this.Activity = act;
                    this.Start = this.Start > this.Activity.calendar[0].date?this.Start:this.Activity.calendar[0].date;
                    if(this.Activity.image_id){
                        this.service.GetImageById(this.Activity.image_id)
                            .subscribe((img:Base64ImageModel)=>{
                                this.ActivityImg = img.base64;
                            })
                    }
                    this.service.GetUserById(this.Activity.user_id)
                        .subscribe((user:UserModel)=>{
                            this.User = user;
                            this.isLoading = false;
                            if(this.User.image_id){
                                this.service.GetImageById(this.User.image_id)
                                    .subscribe((img:Base64ImageModel)=>{
                                        this.UserLogo = img.base64;
                                    })
                            }
                        })
                });
        });
    }
}