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
        address:'',
        from_date:null,
        to_date:null,
        title:'',
        description:''
    };
    bsConfig:Partial<BsDatepickerConfig>;
    constructor(private router: Router,
        private route: ActivatedRoute,
        private service: MainService,
        private params: ActivatedRoute){}

    ngOnInit(){
        this.bsConfig = Object.assign({}, {containerClass: 'theme-default',showWeekNumbers:false});
        let sub:any = this.route.params.subscribe(params => {
            this.Params.limit = +params['limit']; // (+) converts string 'id' to a number
            this.Params.address = params['address'];
            this.Params.title = params['title'];
            this.Params.from_date = params['from_date'];
            
         });
        this.GetAllActivities();
    }


    GetAllActivities(){
        this.isLoading = true;
        
        //this.Params.dates = [this.Start, this.Finish];
        console.log(this.Params);
        this.service.GetAllActivities(this.Params)
        .subscribe((res:ActivityModel[])=>{
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
        },
    (err:any)=>{
        this.SomeErr(err);
    });
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
            this.Params.address = $event.formatted_address;
        }
        else $event = "";
    }
}