import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
import { ActivityModel } from '../../models/activity.model';
import { CreateActivityModel } from '../../models/createActivity.model';
import { Base64ImageModel } from '../../models/base64image.model';

@Component({
    moduleId:module.id,
    selector: 'editActivity',
    templateUrl: './editActivity.component.html',
    providers: [HttpService]
})

export class EditActivityComponent{
    Activity:CreateActivityModel = new CreateActivityModel();
    Start:Date = new Date();
    Finish:Date = new Date();
    isLoading = true;
    actId = 0;
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private service: MainService)
    {
    }

    ngOnInit() {
        this.isLoading = true;
        this.activatedRoute.params.forEach((params:Params) => {
            this.actId = params["id"];
            this.service.GetActivity(this.actId)
                .subscribe((act:ActivityModel)=>{
                    this.AfterGettingActivity(act);
                })
        });
    }

    AfterGettingActivity(act:ActivityModel){
        this.Activity = this.service.ActivityModelToCreateActivityModel(act);
        if(act.image_id)
        {
            this.service.GetImageById(act.image_id)
                .subscribe((res:Base64ImageModel)=>{
                    this.Activity.image = res.base64;
                })
        }
        this.Start = this.Activity.calendar[0];
        this.Finish = this.Activity.calendar[1];
        this.isLoading = false;
    }
    OnEditActivityButtonClick()
    {
        scrollTo(0,0);
        this.isLoading = true;
        this.Activity.calendar = [this.Start, this.Finish];
        console.log(this.Activity);
        this.service.UpdateActivity(this.actId,this.Activity)
        .subscribe((res:ActivityModel)=>{
            console.log(res);
            this.AfterGettingActivity(res);
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