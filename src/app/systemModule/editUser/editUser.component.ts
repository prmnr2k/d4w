import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../core/services/main.service';
import { Router } from '@angular/router';
import { CheckboxModel } from '../../core/models/checkbox.model';
import { TokenModel } from '../../core/models/token.model';
import { UserModel } from '../../core/models/user.model';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { CreateUserModel } from "app/core/models/createUser.model";
import { NgForm, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './editUser.component.html',
  styleUrls: ['./st-form.css']
})
export class EditUserComponent implements OnInit {
    RegistrationErr = false;
    isLoading = true;
    RegErrMsg = '';
    User = new CreateUserModel();
    UserId:number = 0;
    meRole:string = 'guest';
    constructor(private service: MainService, private router: Router) { }

    @ViewChild('submitFormUsr') form: NgForm
    
    ngOnInit() 
    {
        this.service.GetMe()
            .subscribe((user:UserModel)=>{
                    this.InitByUser(user);
                    this.service.GetMyAccess()
                    .subscribe((res)=>{
                        this.meRole = res.role;
                    });
                    this.isLoading = false;
            })
        
    }

    DeleteUser() {
        if(confirm("Are you sure you want to delete your profile?")) {
            this.isLoading = true;
            this.service.DeleteMe()
                .subscribe((res:any)=>{
                    console.log(res);
                    this.service.ClearSession();
                    this.router.navigate(['/login']);
                    
                },
                (err:any)=>{
                    console.log('delete err');
                    console.log(err);
                });
        }
        
    }

    InitByUser(usr:UserModel){
        console.log(usr);
        this.User = this.service.UserModelToCreateUserModel(usr);
        this.UserId = usr.id?usr.id:0;
        if(usr.image_id){
            this.service.GetImageById(usr.image_id)
                .subscribe((res:Base64ImageModel)=>{
                    this.User.image = res.base64;
                });
        }
    }



    UpdateUser(){
        if(this.form.valid){
            this.isLoading = true;
            this.RegistrationErr = false;
            if(!this.CheckUsr()){
                this.RegistrationErr = true;
                this.isLoading = false;
                
                return;
            }
            this.service.UpdateMe(this.User)
                .subscribe((res:UserModel)=>{
                    console.log('ok!');
                    console.log(res);
                    this.InitByUser(res);
                    this.isLoading = false;
                    this.service.onAuthChange$.next(true);
                },
                (err:any)=>{
                    if(err.status == 422){
                        let body:any = JSON.parse(err._body); 
                        this.RegErrMsg = this.service.CheckErrMessage(body);
                        
                    }
                    else {
                        this.RegErrMsg = "Cannot update profile: " + err.body;
                    }
                    this.RegistrationErr = true;
                    this.isLoading = false;
                    
                })
        }
    }

    CheckUsr(){
        //let emailRegexp = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+[.][a-z]{2,4}$');
        let phoneRegexp = new RegExp('^[+]?[0-9]{3,}$');
        /*if(!this.User.email || !this.User.phone || !this.User.address){
            this.RegErrMsg = "Input all fields!";
            return false;
        }*/
        /*if(!(emailRegexp.test(this.User.email))) {
            this.RegErrMsg = "Invalid email!";
            return false;
        }*/

        if(this.User.phone && !(phoneRegexp.test(this.User.phone))) {
            this.RegErrMsg = "Invalid phone number!";
            return false;
        }
       
        return true;
    }

    changeListener($event: any) : void {
        console.log($event);
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
