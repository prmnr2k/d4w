import { Injectable } from "@angular/core";
import { Http, URLSearchParams } from '@angular/http';
import {TokenModel} from "./../models/token.model";
import { HttpService } from './http.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';
import { UserModel } from '../models/user.model';
import { CheckboxModel } from '../models/checkbox.model';
import { CreateCoworkingModel } from '../models/createCoworking.model';
import { AmetiesModel } from '../models/ameties.model';
import { CoworkingModel } from '../models/coworking.model';
import { WorkingDayModel } from '../models/workingDay.model';

@Injectable()
export class MainService{
    public onAuthChange$: Subject<boolean>;
    public me: UserModel;

    constructor(private http: HttpService, private router: Router){
        this.onAuthChange$ = new Subject();
        this.onAuthChange$.next(false);

        this.me = new UserModel();
    }

    /* Authentication BLOCK START */
    IsLogedIn():boolean{
        let token = this.http.GetToken();
        let result = false;
        if(token && token.token)
            result = true;
        return result;
    }
    getToken()
    {
        return this.http.GetToken();
    }

    UserLogin(email:string, password:string){
        let params = {
            email: email,
            password: password
        };
        console.log(params);
        return this.http.PostData('/auth/login',JSON.stringify(params));
    }

    BaseInitAfterLogin(data:TokenModel){
        console.log(data);
        localStorage.setItem('token',data.token);
        this.http.BaseInitByToken(data.token);
        this.GetMe()
            .subscribe((user:UserModel)=>{
                    this.me = user;
                    this.onAuthChange$.next(true);
                });
    }

    TryToLoginWithToken()
    {
        let token = localStorage.getItem('token');
        console.log(token);
        //let token = window.localStorage.getItem('token');
        if(token)
        {
            this.BaseInitAfterLogin(new TokenModel(token));
        }

    }

    Logout(){
        
        this.http.token = null;
        this.http.headers.delete('Authorization');
        this.onAuthChange$.next(false);
        localStorage.removeItem('token');
        //window.localStorage.removeItem('token');
        return this.http.PostData("/auth/logout","");
        
    }
    /* Authentication BLOCK END */

    GetImageById(id:number){
        return this.http.GetData('/images/get/'+id,"");
    }

    /* USERS BLOCK START */
    GetMe(){
        return this.http.GetData('/users/get_me',"");
    }

    GetUserById(id:number){
        return this.http.GetData('/users/get/'+id,"");
    }

    /* USERS BLOCK END */

    /* Coworkings BLOCK START */
    CreateCoworking(data: CreateCoworkingModel){
        return this.http.PostData('/coworkings/create',JSON.stringify(data));
    }

    UpdateCoworking(id:number,data:CreateCoworkingModel){
        return this.http.PutData('/coworkings/update/'+id,JSON.stringify(data));
    }

    GetAllCoworking(params:any){
        return this.http.GetData('/coworkings/get_all',this.ParamsToUrlSearchParams(params));
    }


    CoworkingModelToCreateCoworkingModel(input:CoworkingModel){
        let result = new CreateCoworkingModel();
        if(input){
            result.email = input.email?input.email:'';
            result.full_name = input.full_name?input.full_name:'';
            result.short_name = input.short_name?input.short_name:'';
            result.address = input.address?input.address:'';
            result.description = input.description?input.description:'';
            result.contacts = input.contacts?input.contacts:'';
            result.additional_info = input.additional_info?input.additional_info:'';
            result.price = input.price?input.price:0;
            result.capacity = input.capacity?input.capacity:0;
            result.working_days = input.working_days?input.working_days:[new WorkingDayModel('Monday','09:00','22:00')];
            result.amenties = input.amenties?input.amenties:[];
        }
        result.images = [];


        return result;

    }
    /* Coworkings BLOCK END */


    /* BOOKINGS BLOCK START */
    GetBookingsByCwr(id:number){
        return this.http.GetData('/bookings/get_bookings/'+id,'');
    }

    /* BOOKING BLOCK END */


    /* DATA BLOCK START */

    ParamsToUrlSearchParams(params:any):string{
        let options = new URLSearchParams();

        for(let key in params){
            let prop:any = params[key];
            if(prop){
                if( prop instanceof Array){
                    for(let i in prop){
                        if(prop[i])
                            options.append(key+"[]",prop[i]);
                    }
                }
                else
                    options.set(key,params[key]);
            }
        }
        console.log(options.toString());
        return options.toString();
    }

    public GetAllDays(){
        return [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ];
    }

    public GetAllAmenties(){
        return [
            new CheckboxModel("Free coffee","free_coffee"),
            new CheckboxModel("Coffee","coffee"),
            new CheckboxModel("Free printing","free_printing"),
            new CheckboxModel("Conference room","conference_room"),
            new CheckboxModel("Outdoor space","outdoor_space"),
            new CheckboxModel("Extra monitor","extra_monitor"),
            new CheckboxModel("Nap room","nap_room"),
            new CheckboxModel("Pet friendly","pet_friendly"),
            new CheckboxModel("Kitchen","kitchen"),
            new CheckboxModel("Bike storage","bike_storage"),
            new CheckboxModel("Free parking","free_parking"),
            new CheckboxModel("Parking","parking"),
            new CheckboxModel("Snacks","snacks"),
            new CheckboxModel("Whiteboards","whiteboards"),
            new CheckboxModel("Standing desk","standing_desk"),
            new CheckboxModel("Mail service","mail_service"),
            new CheckboxModel("Phone booth","phone_booth")
        ];
    }

    public GetValuesOfCheckedCB(input:CheckboxModel[]){
        let result:AmetiesModel[] = [];
        for(let i of input){
            if(i.checked)
                result.push(new AmetiesModel(i.value));
        }
        return result;
    }

    public SetCheckedCB(cb:CheckboxModel[], amets:AmetiesModel[]){
        if(amets){
            for(let item of amets){
                let index = cb.findIndex(x=>x.value == item.name);
                if(cb[index]){
                    cb[index].checked = true;
                }
            }
        }
        return cb;
    }
    /* DATA BLOCK END */

}