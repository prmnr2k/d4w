import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
import { ActivityModel } from '../../models/activity.model';
import { CreateActivityModel } from '../../models/createActivity.model';

@Component({
    moduleId:module.id,
    selector: 'createActivity',
    templateUrl: './createActivity.component.html',
    providers: [HttpService]
})

export class CreateActivityComponent{
    Activity:CreateActivityModel = new CreateActivityModel();
    Start:Date = new Date();
    Finish:Date = new Date();
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private service: MainService)
    {
    }

    ngOnInit() {}
    OnCreateActivityButtonClick()
    {
        this.Activity.calendar = [this.Start, this.Finish];
        console.log(this.Activity);
        this.service.CreateActivity(this.Activity)
        .subscribe((res:ActivityModel)=>{
            console.log(res);
        },
    (err:any)=>{
        console.log(err);
    });
    }
    changeListener($event: any) : void {
        this.readThis($event.target);
    }

    readThis(inputValue: any): void {
        let file:File = inputValue.files[0];
        if(!file) return;
        let myReader:FileReader = new FileReader();
        myReader.onloadend = (e) => {
                this.Activity.image = myReader.result;
        }
        myReader.readAsDataURL(file);
    }
}