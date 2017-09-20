import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RouterModule } from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
import { UserModel } from '../../models/user.model';

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
                this.service.GetMe();
            }
            else{
                //this.service.Get;
            }
        });
    }

    SetMenuItem(item:string){
        this.MenuItem = item;
    }

}