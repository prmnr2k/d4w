import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RouterModule } from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
import { RightNavComponent } from '../../components/right.nav/right.nav.component';

@Component({
    selector: "discover",
    templateUrl: "./app/Pages/discover/discover.component.html",
    providers: [HttpService]
})

export class DiscoverComponent implements OnInit{
    IsLoading = true;
    constructor(private router: Router,
        private service: MainService,
        private params: ActivatedRoute){}

    ngOnInit(){
    }
}