import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
import { ActivityModel } from '../../models/activity.model';
import { CreateActivityModel } from '../../models/createActivity.model';
import { UserModel } from '../../models/user.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

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
    Today:Date = new Date();
    isLoading = false;
    isCreateErr = false;
    ErrMsg = '';
    bsConfig:Partial<BsDatepickerConfig>;
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private service: MainService)
    {
    }

    ngOnInit() {
        this.bsConfig = Object.assign({}, {containerClass: 'theme-default',showWeekNumbers:false});
        this.service.GetMe()
            .subscribe((res:UserModel)=>{
                this.Activity.lat = res.lat;
                this.Activity.lng = res.lng;
            })

    }

    CheckActivity():boolean{
        //this.ErrMsg = "Input correct data: "
        this.ErrMsg = "Fill in all fields"
        let len = this.ErrMsg.length + 1;
        this.ErrMsg += "!";
        if(!this.Activity.title){
            //this.ErrMsg += "Title"
            return false;
        }

        if(!this.Activity.image){
            /*if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Picture";*/
            return false;
        }

        if(!this.Activity.price || this.Activity.price < 0){
            /*if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Price";*/
            return false;
        }

        if(!this.Activity.num_of_bookings || this.Activity.num_of_bookings < 0){
            /*if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Number of possible bookings per day";*/
            return false;
        }

        if(!this.Activity.address){
           /* if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Address";*/
            return false;
        }

        if(!this.Activity.detailed_address){
            /*if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Detailed address";*/
            return false;
        }

        if(!this.Activity.description){
            /*if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Description";*/
            return false;
        }

        if(!this.Start){
            /*if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Begining date";*/
            return false;
        }

        if(!this.Finish){
            /*if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Finish date";*/
            return false;
        }

        if(this.Finish < this.Start){
            return false;
        }

        if(!this.Activity.lat && !this.Activity.lng){
            /*if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Mark on the map";*/
            return false;
        }
        //this.ErrMsg += "!";
        return this.ErrMsg.length == len;
    }
    OnCreateActivityButtonClick()
    {
        this.isLoading = true;
        this.isCreateErr = false;
        scrollTo(0,0);
        if(!this.CheckActivity()){
            this.isCreateErr = true;
            this.isLoading = false;
            return;
        }
        this.Activity.calendar = [this.Start, this.Finish];
        console.log(this.Activity);
        this.service.CreateActivity(this.Activity)
        .subscribe((res:ActivityModel)=>{
            this.router.navigate(['/activity',res.id]);
        },
    (err:any)=>{
        this.isLoading=false;
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
    mapClicked($event: any) {
        this.Activity.lat = $event.coords.lat;
        this.Activity.lng = $event.coords.lng;
      }
}