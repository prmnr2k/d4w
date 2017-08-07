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
var token_model_1 = require("./../models/token.model");
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
    new activity_model_1.ActivityModel(1, "addr1", "type1", new Date(), 3.5, "", "", "", "title1", "rule1", "description1", 5, "staff1", 1),
    new activity_model_1.ActivityModel(2, "addr2", "type2", new Date(), 3.5, "", "", "", "title2", "rule2", "description2", 5, "staff2", 1),
    new activity_model_1.ActivityModel(3, "addr3", "type3", new Date(), 3.5, "", "", "", "title3", "rule3", "description3", 5, "staff3", 1),
    new activity_model_1.ActivityModel(4, "addr4", "type4", new Date(), 3.5, "", "", "", "title4", "rule4", "description4", 5, "staff4", 1),
    new activity_model_1.ActivityModel(5, "addr5", "type5", new Date(), 3.5, "", "", "", "title5", "rule5", "description5", 5, "staff5", 1),
    new activity_model_1.ActivityModel(6, "addr6", "type6", new Date(), 3.5, "", "", "", "title6", "rule6", "description6", 5, "staff6", 2),
    new activity_model_1.ActivityModel(7, "addr7", "type7", new Date(), 3.5, "", "", "", "title7", "rule7", "description7", 5, "staff7", 2),
    new activity_model_1.ActivityModel(8, "addr8", "type8", new Date(), 3.5, "", "", "", "title8", "rule8", "description8", 5, "staff8", 2),
    new activity_model_1.ActivityModel(9, "addr9", "type9", new Date(), 3.5, "", "", "", "title9", "rule9", "description9", 5, "staff9", 2),
    new activity_model_1.ActivityModel(10, "addr10", "type10", new Date(), 3.5, "", "", "", "title10", "rule10", "description10", 5, "staff10", 2),
    new activity_model_1.ActivityModel(11, "addr11", "type11", new Date(), 3.5, "", "", "", "title11", "rule11", "description11", 5, "staff11", 3),
    new activity_model_1.ActivityModel(12, "addr12", "type12", new Date(), 3.5, "", "", "", "title12", "rule12", "description12", 5, "staff12", 3),
    new activity_model_1.ActivityModel(13, "addr13", "type13", new Date(), 3.5, "", "", "", "title13", "rule13", "description13", 5, "staff13", 3)
];
var UserList = [
    new user_model_1.UserModel(1, "email1@gmail.com", "First_name1", "Last_name1", "phone1", new Date(), new Date()),
    new user_model_1.UserModel(2, "email2@gmail.com", "First_name2", "Last_name2", "phone2", new Date(), new Date()),
    new user_model_1.UserModel(3, "email3@gmail.com", "First_name3", "Last_name3", "phone3", new Date(), new Date())
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
        });
    };
    MainService.prototype.CreateActivity = function (address, type, background, logo, location, title, rules, descr, bookings, stuff) {
        var _this = this;
        return ActivityPromise
            .then(function (activityList) {
            activityList.push(new activity_model_1.ActivityModel(activityList.length, address, type, new Date(), 0, background, logo, location, title, rules, descr, bookings, stuff, _this.me.id));
        });
    };
    MainService.prototype.GetMe = function () {
        return this.httpService.GetData('/users/my_info', "");
    };
    MainService.prototype.UserLogin = function (email, password) {
        var _this = this;
        return this.httpService.Login(email, password)
            .add(function (data) {
            console.log(data);
            _this.GetMe()
                .subscribe(function (user) {
                _this.me = user;
                _this.onAuthChange$.next(true);
                _this.router.navigate(["users", "me"]);
            });
        });
    };
    MainService.prototype.TryToLoginWithToken = function () {
        var _this = this;
        var token = localStorage.getItem('token');
        if (token) {
            this.httpService.token = new token_model_1.TokenModel(token);
            this.httpService.headers.append('Authorization', token);
        }
        return this.GetMe()
            .subscribe(function (user) {
            _this.me = user;
            _this.onAuthChange$.next(true);
        });
    };
    MainService.prototype.Logout = function () {
        this.httpService.token = null;
        this.httpService.headers.delete('Authorization');
        this.onAuthChange$.next(false);
        localStorage.removeItem('token');
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