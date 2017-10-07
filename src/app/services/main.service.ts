import { Injectable } from "@angular/core";
import { Http, URLSearchParams } from '@angular/http';
import {TokenModel} from "./../models/token.model";
import { HttpService } from "./http.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';
import { UserModel } from '../models/user.model';
import { ActivityModel } from '../models/activity.model';
import { MessageModel } from '../models/message.model';
import { CreateActivityModel } from '../models/createActivity.model';
import { CreateBookingModel } from '../models/createBooking.model';
import { CreateMessageModel } from '../models/createMessage.model';
import { CreateUserModel } from '../models/createUser.model';
import { CalendarModel } from '../models/calendar.model';
import { RateModel } from '../models/rate.model';


    @Injectable()
    export class MainService{

        public onAuthChange$: Subject<boolean>;
        public onPageChange$: Subject<string>;
        public me: UserModel;
        constructor(
            public httpService : HttpService,
            private router: Router
        ){
            
            this.onAuthChange$ = new Subject();
            this.onAuthChange$.next(false);
            this.onPageChange$ = new Subject();
            this.onPageChange$.next('index');
            this.me = new UserModel();
            
        }
        

        ChangePage(page:string){
            this.onPageChange$.next(page);
        }


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

        /*GetCheckedCheckboxes(input:CheckboxModel[]): string[]
        {
            let result: string[]= [];
            let checked:CheckboxModel[]=input.filter(x=>x.checked);
            for(let i of checked)
                result.push(i.value);
            return result;
        }
        GetCheckboxesFromChecked(input:string[],output:CheckboxModel[]):CheckboxModel[]
        {
            output.find(x=> true).checked = false;
            for(let i of input){
                output.find(x=> x.value == i).checked = true;
            }
            return output;
        }

        GetCheckboxNamesFromCheckboxModel(input:string[],cb:CheckboxModel[]){
            let result:string[]= [];
            for(let i of input){
                let res = cb.find(x=> x.value == i);
                if(res && res.name)
                    result.push(res.name);
            }
            return result;
        }*/

        /* Authentication BLOCK START */
        IsLogedIn():boolean{
            let token = this.httpService.GetToken();
            let result = false;
            if(token && token.token)
                result = true;
            return result;
        }
        getTok()
        {
            return this.httpService.GetToken();
        }

        UserLogin(email:string, password:string){
            let params = {
                email: email,
                password: password
            };
            console.log(params);
            return this.httpService.PostData('/auth/login',JSON.stringify(params));
        }

        BaseInitAfterLogin(data:TokenModel){
            localStorage.setItem('token',data.token);
            this.httpService.BaseInitByToken(data.token);
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
            
            this.httpService.token = null;
            this.httpService.headers.delete('Authorization');
            this.onAuthChange$.next(false);
            localStorage.removeItem('token');
            //window.localStorage.removeItem('token');
            return this.httpService.PostData("/auth/logout","");
            
        }
        /* Authentication BLOCK END */

        GetImageById(id:number){
            return this.httpService.GetData('/images/get/'+id,"");
        }

        /* ACTIVITIES BLOCK START */
        GetAllActivities(params?:any){
            return this.httpService.GetData('/activities/get_all',this.ParamsToUrlSearchParams(params));
        }

        GetActivity(id:number){
            return this.httpService.GetData('/activities/get/' + id,"");
        }

        CreateActivity(params:CreateActivityModel){
            return this.httpService.PostData('/activities/create',JSON.stringify(params));
        }    
        
        UpdateActivity(id:number,params:CreateActivityModel){
            return this.httpService.PutData('/activities/update/'+id,JSON.stringify(params));
        }

        DeleteActivity(id:number){
            return this.httpService.DeleteData('/activities/delete/'+id);
        }

        ActivityModelToCreateActivityModel(act:ActivityModel){
            let res:CreateActivityModel = {
                title:act.title,
                price:act.price,
                num_of_bookings:act.num_of_bookings,
                address:act.address,
                detailed_address:act.detailed_address,
                description:act.description,
                calendar:this.CalendarArrToDateArr(act.calendar),
                rate:act.rate
            };
            return res;
        }
        CalendarArrToDateArr(calendar:CalendarModel[]):Date[]{
            let result:Date[] = [];
            for(let item of calendar)
                result.push(item.date);
            return result;
        }
        /* ACTIVITIES BLOCK END */

        /* BOOKINGS BLOCK START */

        GetMyBookings(){
            return this.httpService.GetData('/bookings/get_my_bookings',"");
        }

        GetActivityBookings(id:number){
            return this.httpService.GetData('/bookings/get_activity_bookings/' + id,"");
        }

        GetPastBookings(){
            return this.httpService.GetData("/bookings/get_past_bookings","");
        }

        GetFutureBookings(){
            return this.httpService.GetData("/bookings/get_future_bookings","");
        }

        CreateBooking(params:CreateBookingModel){
            return this.httpService.PostData('/bookings/create',JSON.stringify(params));
        }

        ValidateBooking(params:any){
            return this.httpService.PostData('/bookings/validate_booking', JSON.stringify(params));
        }

        UpdateBooking(id:number, params?:any){
            console.log( JSON.stringify(params));
            return this.httpService.PutData('/bookings/update/' + id, JSON.stringify(params));
        }

        DeleteBooking(id:number){
            return this.httpService.DeleteData('/bookings/delete/' + id);
        }

        /* BOOKINGS BLOCK END */

        /* MESSAGES BLOCK START */

        GetAllMessages(){
            return this.httpService.GetData('/messages/get/',"");
        }

        GetSentMessages(params?:any){
            return this.httpService.GetData('/messages/get_sent',this.ParamsToUrlSearchParams(params));
        }

        GetReceivedMessages(params?:any){
            return this.httpService.GetData('/messages/get_received',this.ParamsToUrlSearchParams(params));
        }

        MarkMessagesAsRead(id:number){
            return this.httpService.PostData('/messages/mark_read/' + id,'');
        }

        CreateMessage(params:CreateMessageModel){
            return this.httpService.PostData('/messages/create',JSON.stringify(params));
        }

        MarkAllAsRead(user_id:number){
            return this.httpService.PostData('/messages/mark_all_read/' + user_id,"");
        }

        GetChatsByUsers(){
            return this.httpService.GetData('/messages/get_messaged_users', "");
        }

        GetChatHistory(params:any){
            return this.httpService.GetData('/messages/get_history',this.ParamsToUrlSearchParams(params));
        }

        /* MESSAGES BLOCK END */

        /* USERS BLOCK START */

        GetAllUsers(params?:any){
            return this.httpService.GetData('/users/get_all',this.ParamsToUrlSearchParams(params));
        }

        GetProffesionals(params?:any){
            return this.httpService.GetData('/users/get_professionals',this.ParamsToUrlSearchParams(params));
        }

        GetMe(){
            return this.httpService.GetData('/users/get_me',"");
        }

        CreateUser(params?:CreateUserModel){
            return this.httpService.PostData('/users/create', JSON.stringify(params));
        }

        UpdateUser(id:number, params?:CreateUserModel){
            return this.httpService.PutData('/users/update/',JSON.stringify(params));
        }

        UserModelToCreateUserModel(user:UserModel){
            let result:CreateUserModel = {
                email : user.email,
                name : user.name,
                date_of_birth : user.date_of_birth,
                gender : user.gender,
                user_type:user.user_type,
                address : (user.user_type == "professional")?user.address:null,
                phone : (user.user_type == "professional")?user.phone:null,
                description : (user.user_type == "professional")?user.description:null
            };
            return result;
        }

        ChangePassword(old_pw:string,new_pw:string){
            return this.httpService.PostData('/users/change_password',JSON.stringify({old_password:old_pw,new_password:new_pw}));
        }

        GetUserById(id:number){
            return this.httpService.GetData('/users/get/'+id,'');
        }

        /* USERS BLOCK END */

        /* COMMENTS BLOCK START */
        GetAllComments(params:any){
            return this.httpService.GetData('/comments/get_all',this.ParamsToUrlSearchParams(params));
        }
        GetCommentById(id:number){
            return this.httpService.GetData('/comments/get/'+id,"");
        }
        CreateComment(params:any){
            return this.httpService.PostData('/comments/create',JSON.stringify(params));
        }
        DeleteComment(id:number){
            return this.httpService.DeleteData('/comments/delete/'+id);
        }
        /* COMMENTS BLOCK END */

        RateActivity(params:any){
            return this.httpService.PostData('/activities/rate',JSON.stringify(params));
        }
        UnRateActivity(activity_id:number)
        {
            return this.httpService.PostData('/activities/onrate',JSON.stringify(activity_id));
        }

    }
