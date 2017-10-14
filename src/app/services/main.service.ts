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
import { CheckboxModel } from '../models/checkbox.model';
import { CategoryModel } from '../models/category.model';


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
        


        /* Authentication BLOCK START */
        IsLogedIn():boolean{
            let token = this.httpService.GetToken();
            let result = false;
            if(token && token.token)
                result = true;
            return result;
        }
        getToken()
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
            console.log(params);
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
                rate:act.rate,
                category:act.category,
                sub_category:act.sub_category
            };
            return res;
        }
        CalendarArrToDateArr(calendar:CalendarModel[]):Date[]{
            let result:Date[] = [];
            for(let item of calendar)
                result.push(item.date);
            return result;
        }

        RateActivity(params:any){
            return this.httpService.PostData('/activities/rate',JSON.stringify(params));
        }
        UnRateActivity(params:any)
        {
            return this.httpService.PostData('/activities/unrate',JSON.stringify(params));
        }
        GetRate(id:number){
            return this.httpService.GetData('/activities/get_my_rate/'+id,"");
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

        /* DATA ACCESS BLOCK START */

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

        
        GetCheckedCheckBoxesValue(input:CheckboxModel[]): string[]
        {
            let result: string[]= [];
            let checked:CheckboxModel[]=input.filter(x=>x.checked);
            for(let i of checked)
                result.push(i.value);
            return result;
        }

        GetCheckBoxValueFromStringArr(input:string[],output:CheckboxModel[]):CheckboxModel[]
        {
            output.find(x=> true).checked = false;
            for(let i of input){
                output.find(x=> x.value == i).checked = true;
            }
            return output;
        }

        /*GetCheckBoxModelFromString(name:string): CheckboxModel{
            return new CheckboxModel(name);
        }*/
        
        GetCheckBoxListFromArray(arr:string[]):CheckboxModel[]{
            let result:CheckboxModel[] = [];
            for(let i of arr){
                result.push(new CheckboxModel(i,i));
            }
            console.log(result);
            return result;
        }

        GetActivityFirstLevelCategories(): string[]{
            let result: string[] = [], iter;
            let categories = this.GetActivityAllCategories();
            let keys = categories.keys();
            while(iter = keys.next().value){
                result.push(iter);
            }
            console.log(result);
            return result;
        }

        GetAddrFromGoogle(keyword:string){
            console.log(`start getaddr`);
            return this.httpService.GoogleGet(keyword);
        }

        GetActivityAllCategories():Map<string,string[]>{
            return new Map<string,string[]>(
                [
                    [
                        "Sport Freestyle",
                        [
                            "Skateboard",
                            "Roller ligne",
                            "Roller 4 roues",
                            "Trotinette",
                            "Bmx"
                        ]
                    ],
                    [
                        "Sport outdoor",
                        [
                            "Cyclisme cyclotourisme",
                            "Cyclisme club",
                            "VTT (rando et terrain de pratique)",
                            "Accro branche",
                            "Tremplin",
                            "Roller",
                            "Ski à Roulette",
                        ]
                    ],
                    [
                        "Sport de précision" ,
                        [
                            "Pétanque",
                            "Echec",
                            "Tir à l’arc",
                            "Tir à la sportif",
                            "Golf"                    
                        ]
                    ],
                    [   
                        "Course à pied",
                        [
                            "Loisir",
                            "Trail"
                        ]
                    ],
                    [
                        "Sport zen et pour tous",
                        [
                            "Randonnée pedestre",
                            "Marche nordique"  
                        ]
                    ],
                    [
                        "Sport détente",
                        [
                            "Yoga",
                            "Pilat",
                            "Methode f..."
                        ]
                    ],
                    [
                        "Sport Fitness",
                        [
                            "Salle de fitness",
                            "Gym suedoise",
                            "Cross Fit"
                        ]
                    ],
                    [
                        "Sport aquatique en bassin",
                        [
                            "Natation détente et loisir",
                            "Natation club",
                            "Apnée",
                            "Plongée",
                            "Natation synchro",
                            "Aquagym",
                            "Nage avec Palmes"
                            
                        ]
                    ],
                    [
                        "Sport aquatique en mer",
                        [
                            "Plongée",
                            "Snorkeling",
                            "pêche sous marine",
                            "Pêche en étan",
                            "Pêche en haute mer",
                            "windsurf",
                            "kite surf",
                            "kayak en mer",
                            "Paddle", 
                            "pirogue",
                            "nage avec Palmes"
                        ]
                    ],
                    [
                        "Sport aquatique bassin ou Lac",
                        [
                            "Ski nautique",
                            "Planche à voile",
                            "Voile",
                            "Kayak"
                        ]
                    ],
                    [
                        "Sport de plage équipe",
                        [
                            "Beach volley",
                            "Beach soccer",
                            "Surf",
                            "Bodyboard"                   
                        ]
                    ],
                    [
                        "Sport en eau vive",
                        [
                            "Kayak",
                            "Kanoe",
                            "Canyoning"
                        ]
                    ],
                    [
                        "Sport de montagne été",
                        [
                            "Alpinisme",
                            "VTT descente",
                            "VTT électrique",
                            "Cyclotourisme",
                            "Pêche",
                            "Parapente",
                            "Escalade",
                            "Via ferrata",
                            "Randonnée haute montagne",
                            "Ski/snowbard",
                            "Ski sur herbe"
                        ]
                    ],
                    [
                        "Sport Combat",
                        [
                            "Judo",
                            "Karaté",
                            "Kung-fu",
                            "Jujitsu",
                            "Mue Taï",
                            "Kick boxing",
                            "Boxe française/savate",
                            "Boxe"                    
                        ]
                    ],
                    [
                        "Sport aérien ou sensation forte",
                        [
                            "Saut en parachute",
                            "Parapente"                   
                        ]
                    ],
                    [
                        "Sport à voile de mer ou en bassin(lac)",
                        [
                            "Char à voile",
                            "Planche à Voile",
                            "Kite surf",
                            "wind surf"
                            
                        ]
                    ],
                    [
                        "Sport équipe ou de ballon",
                        [
                            "Volley (club et terrain)",
                            "Handball (club et terrain)",
                            "Basket (Club et terrain)",
                            "Foot (terrain libre)",
                            "Hockey sur Gazon",
                            "Football (Five)",
                            "Football (Club)",
                            "Quidditch",
                            "Beach soccer"
                        ]
                    ],
                    [
                        "Sports Loisirs et/ou compétitifs individuel et/ou en équipe",
                        [
                            "Billard",
                            "Bowling",
                            "Escrime",
                            "Tennis",
                            "Badminton",
                            "Squash"                    
                        ]
                    ],
                    [
                        "Sensation forte",
                        [
                            "Saut à l’élastique ou bunjjy"
                        ]
                    ],
                    [
                        "Sport Equestre",
                        [
                            "Equitation",
                            "Voltige",
                            "Dressage",,
                            "Saut d’obstacle"                    
                        ]
                    ],
                    [
                        "Sport avec animaux",
                        [
                            "Dressage aigle",
                            "Dressage chien"                    
                        ]
                    ],
                    [
                        "Sport à moteur",
                        [
                            "Karting",
                            "Moto cross",
                            "Buggy",
                            "Quad",
                            "Jet ski"                    
                        ]
                    ],
                    [
                        "A la montagne",
                        [
                            "Ski alpin (ski seul)",
                            "Ski compétition (club)",
                            "Ski alpin (ski seul)",
                            "Ski compétition (club)",
                            "Ski freestyle",
                            "Snow freestyle",
                            "Ski de bosse",
                            "Saut a ski loisir",
                            "Saut a ski club",
                            "Biathlon loisir",
                            "Biathlon club",
                            "Snowboard ou surf des neiges",
                            "Télémark"            
                        ]
                    ],
                    [
                        "Sport de glisse divers",
                        [
                            "Ski joering",
                            "Snowscoot",
                            "VTT sur neige",
                            "Snow kite",
                            "Ski de randonnée group",
                            "Ski de randonnée club",
                            "Surf de randonnée group",
                            "Surf de randonnée club",
                            "Trek",
                            "Luge de loisir",
                            "Luge sur piste bobsleigh"           
                        ]
                    ],
                    [
                        "En ville",
                        [
                            "Ski alpin",
                            "Snowboard indoor",
                            "Ski nordique indoor",
                            "Patinoire (liste patinoire alentour)",
                            "Patinage loisir",
                            "Patinage artistique (club)",
                            "Patinage de vitesse",
                            "Curling",
                            "Hockey su glace (club)"
                        ]
                    ]               
                ]
            );
        }

        GetCategoriesAsArrayCategory():CategoryModel[]{
            let result:CategoryModel[] = [],
            iter,
            categories = this.GetActivityAllCategories();

            let keys = categories.keys();
            while(iter = keys.next().value){
                for(let item of categories.get(iter)){
                    result.push({
                        value:iter + ":" + item,
                        name:item,
                        parent:iter
                    });
                }
            }
            return result;
        }

        GetAllCategoriesAsArrayCategory():CategoryModel[]{
            let result:CategoryModel[] = [],
            iter;
            let categories = this.GetActivityFirstLevelCategories();
            result.push({
                value: '',
                name: '',
                parent: ''
            })
            for(let item of categories){
                result.push({
                    value: item,
                    name: item,
                    parent: ''
                })
            }
            return result.concat(this.GetCategoriesAsArrayCategory());
        }
        /* DATA ACCESS BLOCK END */

    }
