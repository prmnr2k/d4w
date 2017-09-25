import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RouterModule } from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import { ActivityModel } from '../../models/activity.model';
import { MainService } from '../../services/main.service';
import { UserModel } from '../../models/user.model';
import { Base64ImageModel } from '../../models/base64image.model';

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
        limit:10,
        offset:0,
        from_date:null,
        to_date:null,
        title:'',
        description:''
    };
    constructor(private router: Router,
        private service: MainService,
        private params: ActivatedRoute){}

    ngOnInit(){
        this.GetAllActivities();
    }


    GetAllActivities(){
        this.isLoading = true;
        
        //this.Params.dates = [this.Start, this.Finish];
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
}