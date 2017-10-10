import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
import { ActivityModel } from '../../models/activity.model';
import { CreateActivityModel } from '../../models/createActivity.model';
import { Base64ImageModel } from '../../models/base64image.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { UserModel } from '../../models/user.model';
import { Observable } from 'rxjs/Rx';
import { CategoryModel } from '../../models/category.model';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

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
    bsConfig:Partial<BsDatepickerConfig>;
    Categories: CategoryModel[] =[];
    MyCategory:CategoryModel = new CategoryModel();
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private service: MainService,
        private _sanitizer: DomSanitizer)
    {
    }

    ngOnInit() {
        this.bsConfig = Object.assign({}, {containerClass: 'theme-default',showWeekNumbers:false});
        this.isLoading = true;
        this.activatedRoute.params.forEach((params:Params) => {
            this.actId = params["id"];
            this.Categories = this.service.GetCategoriesAsArrayCategory();
            this.service.GetActivity(this.actId)
                .subscribe((act:ActivityModel)=>{
                    this.AfterGettingActivity(act);
                })
            this.service.GetMe()
                .subscribe((res:UserModel)=>{
                    this.Activity.lat = res.lat;
                    this.Activity.lng = res.lng;
                })
        });
    }

    AfterGettingActivity(act:ActivityModel){
        this.Activity = this.service.ActivityModelToCreateActivityModel(act);
        if(this.Activity.sub_category){
            this.MyCategory = this.Categories.find(obj=>obj.value == this.Activity.sub_category);
        }
        if(act.image_id)
        {
            this.service.GetImageById(act.image_id)
                .subscribe((res:Base64ImageModel)=>{
                    this.Activity.image = res.base64;
                })
        }
        this.Start = this.Activity.calendar[0];
        this.Finish = this.Activity.calendar[1]?this.Activity.calendar[1] : new Date();
        this.isLoading = false;
    }
    OnEditActivityButtonClick()
    {
        scrollTo(0,0);
        this.isLoading = true;
        this.service.UpdateActivity(this.actId,this.Activity)
        .subscribe((res:ActivityModel)=>{
            this.router.navigate(['/activity',res.id]);
            /*console.log(res);
            this.AfterGettingActivity(res);*/
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
    mapClicked($event: any) {
        this.Activity.lat = $event.coords.lat;
        this.Activity.lng = $event.coords.lng;
    }
    NewDate(){
        this.Activity.calendar.push(new Date());
    }
    DeleteDate(index:number){
        this.Activity.calendar.splice(index,1);
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
            this.Activity.address = $event.formatted_address;
            if($event.geometry && $event.geometry.location){
                this.Activity.lat = $event.geometry.location.lat;
                this.Activity.lng = $event.geometry.location.lng;
            }
        }
        else $event = "";
    }

    autocompleListFormatter = (data: CategoryModel) : SafeHtml => {
        let html = `<span>${data.parent} : <b>${data.name}</b></span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    }
    CategoryChanged($event:CategoryModel){
        this.MyCategory = $event;
        console.log(this.MyCategory);
        this.Activity.category = this.MyCategory.parent;
        this.Activity.sub_category = this.MyCategory.value;
        console.log(this.Activity);
    }
}