import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RouterModule } from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import { RightNavComponent } from '../../components/right.nav/right.nav.component';
import { ActivityModel } from '../../models/activity.model';
import { MainService } from '../../services/main.service';
import { UserModel } from '../../models/user.model';

@Component({
    selector: "discover",
    templateUrl: "./app/Pages/discover/discover.component.html",
    providers: [HttpService]
})

export class DiscoverComponent implements OnInit{
    IsLoading = true;
    Activities: ActivityModel[] = [];
    constructor(private router: Router,
        private service: MainService,
        private params: ActivatedRoute){}

    ngOnInit(){
        this.service.GetAllActivities()
            .then(result=>{
                this.Activities = result;
                for(let item in this.Activities){

                }
            });
    }
}