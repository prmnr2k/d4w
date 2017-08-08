import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
import { ActivityModel } from '../../models/activity.model';

@Component({
    moduleId: module.id,
    selector:"createActivity",
    templateUrl: "./createActivity.component.ts",
    providers: [HttpService]
})

export class CreateActivityComponent implements OnInit{
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private service: MainService)
    {
    }

    ngOnInit() {
    }
    OnCreateActivityButtonClick(address:string,logo:string,title:string,
                        rules:string,begin:Date,finish:Date,
                        price:number,descr:string,bookings:number)
    {
        this.service.CreateActivity(address,'./production/images/surfer.jpg',title,rules,begin,finish,price,descr,bookings)
            .then(result=>{
                this.service.GetAllActivities()
                    .then(res=>{
                        let act = res.find(x=> x.title==title && x.description==descr && x.price == price);
                        this.router.navigate(['/activity',act.id]);

                    });
            });
    }
}