import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RouterModule } from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
import { UserModel } from '../../models/user.model';
import { Base64ImageModel } from '../../models/base64image.model';

@Component({
    moduleId:module.id,
    selector: "user",
    templateUrl: "./user.component.html",
    providers: [HttpService]
})

export class UserComponent implements OnInit{
    IsLoading = true;
    User:UserModel = new UserModel();
    isMe = false;
    Logo:string = '';
    Background:string = '';
    Diploma:string = '';
    MenuItem = "edit";
    constructor(private router: Router,
        private service: MainService,
        private activatedRoute: ActivatedRoute){}

    ngOnInit(){
        this.activatedRoute.params.forEach((params:Params) => {
            let userId = params["id"];
            console.log(userId);
            //TODO: REWRITE THIS HARDCODE
            if(userId == 'me' || userId == this.service.me.id){
                this.isMe = true;
                this.service.GetMe()
                    .subscribe((res:UserModel)=>{
                        this.AfterGettingUser(res);
                    },
                    (err:any)=>{
                        console.log(err);
                    });
            }
            else{
                //this.service.Get;
            }
        });
    }

    SetMenuItem(item:string){
        this.MenuItem = item;
    }

    AfterGettingUser(user:UserModel){
        this.User = user;
        this.service.GetImageById(this.User.image_id)
            .subscribe((logo:Base64ImageModel)=>{
                this.Logo = logo.base64;
            });
        this.service.GetImageById(this.User.background_id)
            .subscribe((bg:Base64ImageModel)=>{
                this.Background = bg.base64;
            });
        this.service.GetImageById(this.User.diploma_id)
            .subscribe((diploma:Base64ImageModel)=>{
                this.Diploma = diploma.base64;
            });
    }

}