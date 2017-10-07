import { Component,OnInit}      from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpService} from '../../services/http.service';

import {MainService} from "./../../services/main.service";
import { CreateUserModel } from '../../models/createUser.model';
import { UserModel } from '../../models/user.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
    moduleId:module.id,
    selector: "ads",
    templateUrl: "./register.component.html",
    providers: [HttpService]
})

export class RegisterComponent implements OnInit{
    isLoading = true;
    RegisterUser:CreateUserModel = new CreateUserModel();
    isRegOk = false;
    isRegErr = false;
    ErrMsg = '';
    bsConfig:Partial<BsDatepickerConfig>;
    ngOnInit(): void {
        this.bsConfig = Object.assign({}, {containerClass: 'theme-default',showWeekNumbers:false});
        this.isLoading = false;
    }
    constructor(private router: Router,
        private mainService: MainService){}
    Register(){
        this.isRegOk = false;
        this.isRegErr = false;
        this.isLoading = true;
        scrollTo(0,0);
        let regexp = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
        if(!this.RegisterUser.email || !(regexp.test(this.RegisterUser.email)) || !this.RegisterUser.password || this.RegisterUser.password.length < 6){
            this.ErrMsg = "Input correct data!";
            this.isRegErr = true;
            this.isLoading = false;;
            return;
        }


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
                this.isRegOk = true;
                setTimeout(()=>{
                    this.router.navigate(['/login']);
                },5000)
            },
        (err:any)=>{
            console.log(err);
            this.ErrMsg = err._body;
            this.isRegErr = true;
            this.isLoading = false;
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