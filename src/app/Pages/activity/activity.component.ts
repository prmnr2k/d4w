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
    IsLoading = true;
    Activity: ActivityModel = new ActivityModel();
    ActivityImg:string;
    User:UserModel = new UserModel();
    Start:Date = new Date();
    constructor(private router: Router,
        private service: MainService,
        private activatedRoute: ActivatedRoute){}

    ngOnInit(){
        
         this.activatedRoute.params.forEach((params:Params) => {
            let actId= params["id"];
            console.log(actId);
            this.service.GetActivity(actId)
                .subscribe((act:ActivityModel)=>{
                    this.Activity = act;
                    this.Start = this.Activity.calendar[0].date;
                    console.log(this.Activity);
                    this.service.GetImageById(this.Activity.image_id)
                        .subscribe((img:Base64ImageModel)=>{
                            this.ActivityImg = img.base64;
                        })
                });
        });
    }
}