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
    new ActivityModel(1,"addr1","type1",new Date(),3.5,"","","","title1","rule1","description1",5,"staff1",1),
    new ActivityModel(2,"addr2","type2",new Date(),3.5,"","","","title2","rule2","description2",5,"staff2",1),
    new ActivityModel(3,"addr3","type3",new Date(),3.5,"","","","title3","rule3","description3",5,"staff3",1),
    new ActivityModel(4,"addr4","type4",new Date(),3.5,"","","","title4","rule4","description4",5,"staff4",1),
    new ActivityModel(5,"addr5","type5",new Date(),3.5,"","","","title5","rule5","description5",5,"staff5",1),
    new ActivityModel(6,"addr6","type6",new Date(),3.5,"","","","title6","rule6","description6",5,"staff6",2),
    new ActivityModel(7,"addr7","type7",new Date(),3.5,"","","","title7","rule7","description7",5,"staff7",2),
    new ActivityModel(8,"addr8","type8",new Date(),3.5,"","","","title8","rule8","description8",5,"staff8",2),
    new ActivityModel(9,"addr9","type9",new Date(),3.5,"","","","title9","rule9","description9",5,"staff9",2),
    new ActivityModel(10,"addr10","type10",new Date(),3.5,"","","","title10","rule10","description10",5,"staff10",2),
    new ActivityModel(11,"addr11","type11",new Date(),3.5,"","","","title11","rule11","description11",5,"staff11",3),
    new ActivityModel(12,"addr12","type12",new Date(),3.5,"","","","title12","rule12","description12",5,"staff12",3),
    new ActivityModel(13,"addr13","type13",new Date(),3.5,"","","","title13","rule13","description13",5,"staff13",3)
];

let UserList:UserModel[] = [
    new UserModel(1,"email1@gmail.com","First_name1","Last_name1","phone1",new Date(),new Date()),
    new UserModel(2,"email2@gmail.com","First_name2","Last_name2","phone2",new Date(),new Date()),
    new UserModel(3,"email3@gmail.com","First_name3","Last_name3","phone3",new Date(),new Date())
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
                })
        }
        CreateActivity(address:string, type:string,background:string,logo:string,
                        location:string,title:string,rules:string,descr:string,
                        bookings:number,stuff:string)
        {
            return ActivityPromise
                .then(activityList=>{
                    activityList.push(new ActivityModel(
                        activityList.length,
                        address,
                        type,
                        new Date(),
                        0,
                        background,
                        logo,
                        location,
                        title,
                        rules,
                        descr,
                        bookings,
                        stuff,
                        this.me.id));
                })
        }


        GetMe(){
            return this.httpService.GetData('/users/my_info',"");
        }

        UserLogin(email:string, password:string){
            
            return this.httpService.Login(email,password)
                .add((data:TokenModel)=>{
                    console.log(data);
                    
                    this.GetMe()
                        .subscribe((user:UserModel)=>{
                                this.me = user;
                                this.onAuthChange$.next(true);
                                this.router.navigate(["users","me"]);
                            });
                        
                });
                
        }

        TryToLoginWithToken()
        {
            let token = localStorage.getItem('token');
            if(token)
            {
                this.httpService.token = new TokenModel(token);
                this.httpService.headers.append('Authorization',token);
            }
            return this.GetMe()
                .subscribe((user:UserModel)=>{
                        this.me = user;
                        this.onAuthChange$.next(true);
                    });

        }

        Logout(){
            this.httpService.token = null;
            this.httpService.headers.delete('Authorization');
            this.onAuthChange$.next(false);
            localStorage.removeItem('token');
        }

        
    }
