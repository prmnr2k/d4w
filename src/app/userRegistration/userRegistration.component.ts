import { Component, OnInit } from '@angular/core';
import { MainService } from '../core/services/main.service';
import { Router } from '@angular/router';
import { CheckboxModel } from '../core/models/checkbox.model';
import { TokenModel } from '../core/models/token.model';
import { CreateUserModel } from "app/core/models/createUser.model";
import { UserModel } from "app/core/models/user.model";

@Component({
  selector: 'app-registration',
  templateUrl: './userRegistration.component.html'
})
export class UserRegistrationComponent implements OnInit {
    RegistrationErr = false;
    isLoading = true;
    RegErrMsg = '';
    User = new CreateUserModel();
    constructor(private service: MainService, private router: Router) { }

    ngOnInit() 
    {
        this.isLoading = false;
    }

    DeleteImage(i:number){
        this.User.image = null;
    }
    CreateUser(){
        
        this.isLoading = true;
        this.RegistrationErr = false;
        if(!this.CheckUsr()){
            scroll(1, 1);
            this.RegistrationErr = true;
            this.isLoading = false;
            
            return;
        }
        this.service.CreateUser(this.User)
            .subscribe((res:UserModel)=>{
                console.log(res);
                this.service.UserLogin(this.User.email,this.User.password)
                    .subscribe((res:TokenModel)=>{
                        console.log(res);
                        this.service.BaseInitAfterLogin(res);
                        this.router.navigate(['/']);
                    }
                    ,
                    (err:any)=>{
                        this.RegErrMsg = "You were registered but sign in is failed. Try to login by yourself!";
                        this.RegistrationErr = true;
                        this.isLoading = false;
                    });
            },
            (err)=>{
                this.RegErrMsg = "Cannot create profile: " + err.body;
                this.RegistrationErr = true;
                this.isLoading = false;
            })
    }

    CheckUsr(){
        if(!this.User.email || !this.User.phone || !this.User.address){
            this.RegErrMsg = "Input all fields!";
            return false;
        }
        if(!this.User.password || !this.User.password_confirmation)
        {
            this.RegErrMsg = "Input password and password confirmation!";
            return false;
        }
        if(this.User.password != this.User.password_confirmation)
        {
            this.RegErrMsg = "Passwords are not matched!";
            return false;
        }
        return true;
    }
    changeListener($event: any) : void {
        this.readThis($event.target);
    }

    readThis(inputValue: any): void {
        for(let f of inputValue.files){
            let file:File = f;
            if(!file) return;
            let myReader:FileReader = new FileReader();
            myReader.onloadend = (e) => {
                    this.User.image = myReader.result;
            }
            myReader.readAsDataURL(file);
        }
    }

}
