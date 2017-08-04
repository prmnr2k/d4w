import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RouterModule } from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import { NewsModel} from "./../../models/news.model";
import { AllNewsModel} from "./../../models/allnews.model";

import {MainService} from "./../../services/main.service";
import { RightNavComponent } from '../../components/right.nav/right.nav.component';

@Component({
    selector: "activity",
    templateUrl: "./app/Pages/activity/activity.component.html",
    providers: [HttpService]
})

export class ActivityComponent implements OnInit{
    IsLoading = true;
    constructor(private router: Router,
        private service: MainService,
        private params: ActivatedRoute){}

    ngOnInit(){
    }
}