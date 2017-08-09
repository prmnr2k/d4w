"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_service_1 = require("./http.service");
var router_1 = require("@angular/router");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/observable/throw");
require("rxjs/Rx");
var Subject_1 = require("rxjs/Subject");
var user_model_1 = require("../models/user.model");
var activity_model_1 = require("../models/activity.model");
var message_model_1 = require("../models/message.model");
var ActivityList = [
    new activity_model_1.ActivityModel(1, "Act1", "./production/images/parashut.jpg", "rules", new Date("2017-10-10"), new Date("2017-10-20"), 150, 10, "address1", "description1", new Date(), new Date(), 1),
    new activity_model_1.ActivityModel(2, "Act2", "./production/images/parashut.jpg", "rules", new Date("2017-10-10"), new Date("2017-10-20"), 150, 10, "address1", "description1", new Date(), new Date(), 1),
    new activity_model_1.ActivityModel(3, "Act3", "./production/images/surfer.jpg", "rules", new Date("2017-10-10"), new Date("2017-10-20"), 150, 10, "address1", "description1", new Date(), new Date(), 2),
    new activity_model_1.ActivityModel(4, "Act4", "./production/images/child.jpg", "rules", new Date("2017-10-10"), new Date("2017-10-20"), 150, 10, "address1", "description1", new Date(), new Date(), 2)
];
var UserList = [
    new user_model_1.UserModel(1, "pro", "male", new Date("1994-06-05"), "./production/images/man.jpg", "source/images/userspace.png", [], "email1@email.com", "User1 Pro1", "+701234567890", null, "description1", "123456", new Date(), new Date()),
    new user_model_1.UserModel(2, "pro", "male", new Date("1994-06-05"), "./production/images/man.jpg", "source/images/userspace.png", [], "email2@email.com", "User2 Pro2", "+701234567891", null, "description2", "123456", new Date(), new Date()),
    new user_model_1.UserModel(3, "client", "male", new Date("1994-06-05"), "./production/images/man.jpg", null, null, "email3@email.com", "User3 Client3", "+712345678910", null, null, "123456", new Date(), new Date())
];
var MessageList = [
    new message_model_1.MessageModel("text1", 1, 2),
    new message_model_1.MessageModel("text2", 2, 1),
    new message_model_1.MessageModel("text3", 2, 1),
    new message_model_1.MessageModel("text4", 1, 2),
    new message_model_1.MessageModel("text5", 1, 2),
    new message_model_1.MessageModel("text6", 1, 2),
    new message_model_1.MessageModel("text7", 1, 2),
    new message_model_1.MessageModel("text8", 1, 2),
    new message_model_1.MessageModel("text9", 1, 2),
    new message_model_1.MessageModel("text11", 3, 2),
    new message_model_1.MessageModel("text12", 3, 2),
    new message_model_1.MessageModel("text13", 3, 2),
    new message_model_1.MessageModel("text14", 1, 2),
    new message_model_1.MessageModel("text15", 1, 2),
    new message_model_1.MessageModel("text16", 1, 3),
    new message_model_1.MessageModel("text17", 3, 1),
    new message_model_1.MessageModel("text18", 1, 3),
    new message_model_1.MessageModel("text19", 3, 1)
];
var ActivityPromise = Promise.resolve(ActivityList);
var UserPromise = Promise.resolve(UserList);
var MessagePromise = Promise.resolve(MessageList);
var MainService = (function () {
    function MainService(httpService, router) {
        this.httpService = httpService;
        this.router = router;
        this.me = UserList.find(function (x) { return x.id == 1; });
        this.onAuthChange$ = new Subject_1.Subject();
        this.onAuthChange$.next(false);
    }
    MainService.prototype.MainInit = function () {
        //localStorage.clear();//optional, when models changed
        var activities = JSON.parse(localStorage.getItem('ActivityList'));
        if (!activities || activities.length == 0) {
            localStorage.setItem('ActivityList', JSON.stringify(ActivityList));
            console.log("activities now not empty");
        }
        else {
            ActivityPromise = Promise.resolve(activities);
            console.log(activities);
        }
        var users = JSON.parse(localStorage.getItem('UserList'));
        if (!users || users.length == 0) {
            localStorage.setItem('UserList', JSON.stringify(UserList));
            console.log("users now not empty");
        }
        else {
            UserPromise = Promise.resolve(users);
            console.log(users);
        }
        var messages = JSON.parse(localStorage.getItem('MessageList'));
        if (!messages || messages.length == 0) {
            localStorage.setItem('MessageList', JSON.stringify(MessageList));
            console.log("messages now not empty");
        }
        else {
            MessagePromise = Promise.resolve(messages);
            console.log(messages);
        }
    };
    MainService.prototype.CreateUser = function (user_type, gender, birthday, profile_picture, background, gallery, full_name, email, phone, diploma_photo, activity_descr, password) {
        return UserPromise
            .then(function (users) {
            users.push(new user_model_1.UserModel(users.length + 1, user_type, gender, birthday, profile_picture, background, gallery, email, full_name, phone, diploma_photo, activity_descr, password, new Date(), new Date()));
            localStorage.setItem('UserList', JSON.stringify(users));
        });
    };
    MainService.prototype.GetAllUsers = function () {
        return UserPromise;
    };
    MainService.prototype.GetAllMessages = function (sender) {
        return MessagePromise
            .then(function (messages) {
            messages.find(function (x) { return x.sender == sender; });
        });
    };
    MainService.prototype.SendMessage = function (content, rec) {
        var _this = this;
        return MessagePromise
            .then(function (messages) {
            messages.push(new message_model_1.MessageModel(content, _this.me.id, rec));
            localStorage.setItem('MessageList', JSON.stringify(messages));
        });
    };
    MainService.prototype.GetAllActivities = function () {
        return ActivityPromise;
    };
    MainService.prototype.GetActivityById = function (id) {
        return ActivityPromise
            .then(function (activity) { return activity.find(function (x) { return x.id == id; }); });
    };
    MainService.prototype.DeleteActivityById = function (id) {
        return ActivityPromise
            .then(function (activityList) {
            var activity = activityList.find(function (x) { return x.id == id; })[0];
            activityList.splice(activityList.indexOf(activity), 1);
            localStorage.setItem('ActivityList', JSON.stringify(activityList));
        });
    };
    MainService.prototype.CreateActivity = function (address, logo, title, rules, begin, finish, price, descr, bookings) {
        var _this = this;
        return ActivityPromise
            .then(function (activityList) {
            var activity = new activity_model_1.ActivityModel(activityList.length + 1, title, logo, rules, begin, finish, price, bookings, address, descr, new Date(), new Date(), _this.me.id);
            console.log(activity);
            activityList.push(activity);
            localStorage.setItem('ActivityList', JSON.stringify(activityList));
        });
    };
    MainService.prototype.GetMe = function () {
        var _this = this;
        return UserPromise
            .then(function (users) { return users.find(function (x) { return x.id == _this.me.id; }); });
        //return this.httpService.GetData('/users/my_info',"");
    };
    MainService.prototype.GetUserById = function (id) {
        return UserPromise
            .then(function (users) { return users.find(function (x) { return x.id == id; }); });
    };
    MainService.prototype.UserLogin = function (email, password) {
        var _this = this;
        return UserPromise
            .then(function (users) {
            var me = users.find(function (x) { return x.email == email; });
            if (me && me.password == password) {
                _this.me = me;
                _this.onAuthChange$.next(true);
                localStorage.setItem('CurrentUser', JSON.stringify(me));
                console.log(localStorage.getItem('CurrentUser'));
            }
        });
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
    };
    MainService.prototype.TryToLoginWithToken = function () {
        var me = JSON.parse(localStorage.getItem('CurrentUser'));
        if (me && me.id) {
            this.me = me;
            this.onAuthChange$.next(true);
            localStorage.setItem('CurrentUser', JSON.stringify(me));
        }
        else {
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
    };
    MainService.prototype.Logout = function () {
        this.me = null;
        this.onAuthChange$.next(false);
        localStorage.removeItem('CurrentUser');
        /*this.httpService.token = null;
        this.httpService.headers.delete('Authorization');
        this.onAuthChange$.next(false);
        localStorage.removeItem('token');*/
    };
    return MainService;
}());
MainService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_service_1.HttpService,
        router_1.Router])
], MainService);
exports.MainService = MainService;
//# sourceMappingURL=main.service.js.map