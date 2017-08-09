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


let ActivityList:ActivityModel[]=[
    new ActivityModel(1,"Act1","./production/images/parashut.jpg","rules",new Date("2017-10-10"),new Date("2017-10-20"),150,10,
                "address1","description1",new Date(),new Date(),1),
    new ActivityModel(2,"Act2","./production/images/parashut.jpg","rules",new Date("2017-10-10"),new Date("2017-10-20"),150,10,
                "address1","description1",new Date(),new Date(),1),
    new ActivityModel(3,"Act3","./production/images/surfer.jpg","rules",new Date("2017-10-10"),new Date("2017-10-20"),150,10,
                "address1","description1",new Date(),new Date(),2),
    new ActivityModel(4,"Act4","./production/images/child.jpg","rules",new Date("2017-10-10"),new Date("2017-10-20"),150,10,
                "address1","description1",new Date(),new Date(),2)
];

let UserList:UserModel[] = [
    new UserModel(1,"pro","male",new Date("1994-06-05"),"./production/images/man.jpg",
                "source/images/userspace.png",[],"email1@email.com","User1 Pro1","+701234567890",
                null,"description1","123456",new Date(),new Date()),
    new UserModel(2,"pro","male",new Date("1994-06-05"),"./production/images/man.jpg",
                "source/images/userspace.png",[],"email2@email.com","User2 Pro2","+701234567891",
                null,"description2","123456",new Date(),new Date()),
    new UserModel(3,"client","male",new Date("1994-06-05"),"./production/images/man.jpg",
                null,null,"email3@email.com","User3 Client3","+712345678910",null,null,
                "123456",new Date(),new Date())
];

let MessageList:MessageModel[] = [
    new MessageModel("text1",1,2),
    new MessageModel("text2",2,1),
    new MessageModel("text3",2,1),
    new MessageModel("text4",1,2),
    new MessageModel("text5",1,2),
    new MessageModel("text6",1,2),
    new MessageModel("text7",1,2),
    new MessageModel("text8",1,2),
    new MessageModel("text9",1,2),
    new MessageModel("text11",3,2),
    new MessageModel("text12",3,2),
    new MessageModel("text13",3,2),
    new MessageModel("text14",1,2),
    new MessageModel("text15",1,2),
    new MessageModel("text16",1,3),
    new MessageModel("text17",3,1),
    new MessageModel("text18",1,3),
    new MessageModel("text19",3,1)
];


let ActivityPromise = Promise.resolve(ActivityList);
let UserPromise = Promise.resolve(UserList);
let MessagePromise = Promise.resolve(MessageList);
    @Injectable()
    export class MainService{

        public onAuthChange$: Subject<boolean>;
        constructor(
            public httpService : HttpService,
            private router: Router
        ){
            this.onAuthChange$ = new Subject();
            this.onAuthChange$.next(false);
        }
        public me: UserModel = UserList.find(x=> x.id == 1);


        MainInit(){
            //localStorage.clear();//optional, when models changed

            let activities = JSON.parse(localStorage.getItem('ActivityList'));
            if(!activities || activities.length == 0){
                localStorage.setItem('ActivityList',JSON.stringify(ActivityList));
                console.log("activities now not empty");
            }
            else{
                ActivityPromise = Promise.resolve(activities);
                console.log(activities);
            }
            
            let users = JSON.parse(localStorage.getItem('UserList'));
            if(!users || users.length == 0){
                localStorage.setItem('UserList',JSON.stringify(UserList));
                console.log("users now not empty");
            }
            else{
                UserPromise = Promise.resolve(users);
                console.log(users);
            }

            let messages = JSON.parse(localStorage.getItem('MessageList'));
            if(!messages || messages.length == 0){
                localStorage.setItem('MessageList',JSON.stringify(MessageList));
                console.log("messages now not empty");
            }
            else{
                MessagePromise = Promise.resolve(messages);
                console.log(messages);
            }
        }

        CreateUser(user_type:string, gender:string,birthday:Date,profile_picture:string,
                background:string,gallery:string[],full_name:string,email:string,phone:string,
                diploma_photo:string,activity_descr:string,password:string){
            return UserPromise
                .then(users=>{
                    users.push(new UserModel(
                        users.length + 1,
                        user_type,
                        gender,
                        birthday,
                        profile_picture,
                        background,
                        gallery,
                        email,
                        full_name,
                        phone,
                        diploma_photo,
                        activity_descr,
                        password,
                        new Date(),
                        new Date()
                    ));
                    localStorage.setItem('UserList',JSON.stringify(users));
                })
        }

        GetAllUsers(){
            return UserPromise;
        }
        GetAllMessages(sender:number){
            return MessagePromise
                .then(messages =>{
                    messages.find(x=>x.sender == sender);
                })
        }
        
        SendMessage(content:string,rec:number){
            return MessagePromise
                .then(messages=>{
                    messages.push(new MessageModel(content,this.me.id,rec));
                    localStorage.setItem('MessageList',JSON.stringify(messages));
                })
        }

        GetAllActivities(){
            return ActivityPromise;
        }
        GetActivityById(id:number){
            return ActivityPromise
                .then(activity => activity.find(x=> x.id == id));
        }
        DeleteActivityById(id:number){
            return ActivityPromise
                .then(activityList =>{
                    let activity = activityList.find(x=> x.id == id)[0];
                    activityList.splice(activityList.indexOf(activity),1);
                    localStorage.setItem('ActivityList',JSON.stringify(activityList));
                })
        }
        CreateActivity(address:string,logo:string,title:string,
                        rules:string,begin:Date,finish:Date,
                        price:number,descr:string,bookings:number)
        {
            return ActivityPromise
                .then(activityList=>{
                    let activity = new ActivityModel(
                        activityList.length +1,
                        title,
                        logo,
                        rules,
                        begin,
                        finish,
                        price,
                        bookings,
                        address,
                        descr,
                        new Date(),
                        new Date(),
                        this.me.id
                    );
                    console.log(activity);
                    activityList.push(activity);
                    localStorage.setItem('ActivityList',JSON.stringify(activityList));
                })
        }


        GetMe(){
            return UserPromise
                .then(users=> users.find(x=>x.id == this.me.id))
            //return this.httpService.GetData('/users/my_info',"");
        }

        GetUserById(id:number){
            return UserPromise
                .then(users=>users.find(x=>x.id == id));
        }

        UserLogin(email:string, password:string){
            return UserPromise
                .then(users=>{
                    let me = users.find(x=>x.email == email);
                    if(me && me.password == password){
                        this.me = me;
                        this.onAuthChange$.next(true);
                        localStorage.setItem('CurrentUser',JSON.stringify(me));
                        console.log(localStorage.getItem('CurrentUser'));
                    }
                })
            /*return this.httpService.Login(email,password)
                .add((data:TokenModel)=>{
                    console.log(data);
                    
                    this.GetMe()
                        .subscribe((user:UserModel)=>{
                                this.me = user;
                                this.onAuthChange$.next(true);
                                this.router.navigate(["users","me"]);
                            });
                        
                });*/
                
        }

        TryToLoginWithToken()
        {
            let me : UserModel = JSON.parse(localStorage.getItem('CurrentUser'));
            if(me && me.id){
                this.me = me;
                this.onAuthChange$.next(true);
                localStorage.setItem('CurrentUser',JSON.stringify(me));
            }
            else{
                this.onAuthChange$.next(false);
            }
            /*let token = localStorage.getItem('token');
            if(token)
            {
                this.httpService.token = new TokenModel(token);
                this.httpService.headers.append('Authorization',token);
            }
            return this.GetMe()
                .subscribe((user:UserModel)=>{
                        this.me = user;
                        this.onAuthChange$.next(true);
                    });*/

        }

        Logout(){
            this.me = null;
            this.onAuthChange$.next(false);
            localStorage.removeItem('CurrentUser');
            /*this.httpService.token = null;
            this.httpService.headers.delete('Authorization');
            this.onAuthChange$.next(false);
            localStorage.removeItem('token');*/
        }

        
    }
