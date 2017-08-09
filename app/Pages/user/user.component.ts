import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RouterModule } from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
import { RightNavComponent } from '../../components/right.nav/right.nav.component';
import { UserModel } from '../../models/user.model';

@Component({
    selector: "user",
    templateUrl: "./app/Pages/user/user.component.html",
    providers: [HttpService]
})

export class UserComponent implements OnInit{
    IsLoading = true;
    User:UserModel = new UserModel(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
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
                this.service.GetMe()
                    .then(result=>{
                        this.User = result;
                        console.log("ME");
                        console.log(this.User);
                    });
                    /*.subscribe((data:UserModel) => {
                        if(data.id){
                            this.User = data;
                            console.log(this.User);
                            this.IsLoading = false;
                        }
                    });*/
            }
            else{
                this.service.GetUserById(userId)
                    .then(result=>{
                        this.User = result;
                        console.log(this.User);
                    });
                    /*.subscribe((data:UserModel) => {
                        this.User = data;
                        console.log(this.User);
                        this.IsLoading = false;
                    });*/
            }
        });
    }

    SetMenuItem(item:string){
        this.MenuItem = item;
    }

}