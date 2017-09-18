import { Component,OnInit}      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
import { CreateUserModel } from '../../models/createUser.model';
import { UserModel } from '../../models/user.model';

@Component({
    selector: "ads",
    templateUrl: "app/Pages/register/register.component.html",
    providers: [HttpService]
})

export class RegisterComponent implements OnInit{
    RegisterUser:CreateUserModel = new CreateUserModel();
    ngOnInit(): void {
    }
    constructor(private router: Router,
        private mainService: MainService){}
    Register(){
        console.log(this.RegisterUser);
        if(this.RegisterUser.user_type == 'client'){
            this.RegisterUser.address = null;
            this.RegisterUser.phone = null;
            this.RegisterUser.description = null;
            this.RegisterUser.diploma = null;
            this.RegisterUser.background = null;
        }
        this.mainService.CreateUser(this.RegisterUser)
            .subscribe((result:UserModel)=>{
                console.log(result);
            },
        (err:any)=>{
            console.log(err);
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
                this.RegisterUser.image = myReader.result;
            }
            else if(field == 'diploma')
            {
                this.RegisterUser.diploma = myReader.result;
            }
            else {
                this.RegisterUser.background = myReader.result;
            }
        }
        myReader.readAsDataURL(file);
    }
}