import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
import { ActivityModel } from '../../models/activity.model';
import { CreateActivityModel } from '../../models/createActivity.model';
import { UserModel } from '../../models/user.model';

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
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private service: MainService)
    {
    }

    ngOnInit() {
        this.service.GetMe()
            .subscribe((res:UserModel)=>{
                this.Activity.lat = res.lat;
                this.Activity.lng = res.lng;
            })

    }

    CheckActivity():boolean{
        this.ErrMsg = "Input correct data: "
        let len = this.ErrMsg.length;
        if(!this.Activity.title){
            this.ErrMsg += "Title"
        }
        if(!this.Activity.image){
            if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Picture";
        }

        if(!this.Activity.price){
            if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Price";
        }

        if(!this.Activity.num_of_bookings){
            if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Number of possible bookings per day";
        }

        if(!this.Activity.address){
            if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Address";
        }

        if(!this.Activity.detailed_address){
            if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Detailed address";
        }

        if(!this.Activity.description){
            if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Description";
        }

        if(!this.Start){
            if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Begining date";
        }

        if(!this.Finish){
            if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Finish date";
        }

        if(!this.Activity.lat && !this.Activity.lng){
            if(len < this.ErrMsg.length)
                this.ErrMsg += ",";
            this.ErrMsg += "Mark on the map";
        }
        console.log(this.ErrMsg);
        console.log(this.ErrMsg.length);
        console.log(len);
        return (this.ErrMsg.length + 1) > len;
    }
    OnCreateActivityButtonClick()
    {
        this.isLoading = true;
        this.isCreateErr = false;
        scrollTo(0,0);
        if(this.CheckActivity()){
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