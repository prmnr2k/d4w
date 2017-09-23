import { Component,OnInit }      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RouterModule } from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
import { UserModel } from '../../models/user.model';
import { Base64ImageModel } from '../../models/base64image.model';
import { CreateUserModel } from '../../models/createUser.model';

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
    Logo:string = "./app/images/man.jpg";
    Background:string = "./app/images/hero-back.png";
    Diploma:string = '';
    MenuItem = "edit";
    ProfileMenu = "profile";
    UserUpdate:CreateUserModel = new CreateUserModel();
    constructor(private router: Router,
        private service: MainService,
        private activatedRoute: ActivatedRoute){}

    ngOnInit(){
        this.activatedRoute.params.forEach((params:Params) => {
            let userId = params["id"];
            console.log(userId);
            //TODO: REWRITE THIS HARDCODE
            if(userId == 'me' /*|| userId == this.service.me.id*/){
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
               this.service.GetUserById(userId)
                .subscribe((user:UserModel)=>{
                    this.AfterGettingUser(user);
                });
            }
        });
    }

    SetMenuItem(item:string){
        this.MenuItem = item;
    }

    AfterGettingUser(user:UserModel){
        this.User = user;
        if(this.isMe)
            this.UserUpdate = this.service.UserModelToCreateUserModel(this.User);
        if(this.User.image_id){
            this.service.GetImageById(this.User.image_id)
                .subscribe((logo:Base64ImageModel)=>{
                    this.Logo = logo.base64;
                });
        }
        if(this.User.background_id){
            this.service.GetImageById(this.User.background_id)
                .subscribe((bg:Base64ImageModel)=>{
                    this.Background = bg.base64;
                });
        }
        if(this.User.diploma_id){
            this.service.GetImageById(this.User.diploma_id)
                .subscribe((diploma:Base64ImageModel)=>{
                    this.Diploma = diploma.base64;
                });
        }
    }

    ChangePw(old_password:string,new_password:string){
        this.service.ChangePassword(old_password,new_password)
            .subscribe((res:UserModel)=>{
                console.log(res);
                this.AfterGettingUser(res);
            },
            (err:any)=>{
                console.log(err);
            })
    }

    UpdateUser(){
        this.service.UpdateUser(this.User.id,this.UserUpdate)
            .subscribe((res:UserModel)=>{
                console.log(res);
                this.AfterGettingUser(res);
            })
            
    }

    changeListener(field:string,$event: any) : void {
        this.readThis(field,$event.target);
    }

    readThis(field:string,inputValue: any): void {
        let file:File = inputValue.files[0];
        if(!file) return;
        let myReader:FileReader = new FileReader();
        myReader.onloadend = (e) => {
            if(field == 'user_logo'){
                this.UserUpdate.image = myReader.result;
            }
            else if(field == 'diploma')
            {
                this.UserUpdate.diploma = myReader.result;
            }
            else {
                this.UserUpdate.background = myReader.result;
            }
        }
        myReader.readAsDataURL(file);
    }

}