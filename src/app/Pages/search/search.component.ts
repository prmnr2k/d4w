import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RouterModule } from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
import { ActivityModel } from '../../models/activity.model';
import { UserModel } from '../../models/user.model';

@Component({
    moduleId:module.id,
    selector: "search",
    templateUrl: "./search.component.html",
    providers: [HttpService]
})

export class SearchComponent implements OnInit{
    Activities: ActivityModel[] = [];
    Params = {
        title:'',
        description:'',
        address:'',
        dates:'',
        radius:15
    }
    lat:number = 48.8916733;
    lng:number = 2.3016161;
    constructor(private router: Router,
        private service: MainService,
        private params: ActivatedRoute){}

    ngOnInit(){
        this.service.GetMe()
            .subscribe((res:UserModel)=>{
                this.lat = res.lat;
                this.lng = res.lng;
            })
        this.service.GetAllActivities();
    }
    mapClicked($event: any) {
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;
      }
}