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
var http_1 = require("@angular/http");
var token_model_1 = require("./../models/token.model");
var http_service_1 = require("./http.service");
var router_1 = require("@angular/router");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/observable/throw");
require("rxjs/Rx");
var Subject_1 = require("rxjs/Subject");
var user_model_1 = require("../models/user.model");
var MainService = (function () {
    function MainService(httpService, router) {
        this.httpService = httpService;
        this.router = router;
        this.onAuthChange$ = new Subject_1.Subject();
        this.onAuthChange$.next(false);
        this.onPageChange$ = new Subject_1.Subject();
        this.onPageChange$.next('index');
        this.me = new user_model_1.UserModel();
    }
    MainService.prototype.ChangePage = function (page) {
        this.onPageChange$.next(page);
    };
    MainService.prototype.ParamsToUrlSearchParams = function (params) {
        var options = new http_1.URLSearchParams();
        for (var key in params) {
            var prop = params[key];
            if (prop) {
                if (prop instanceof Array) {
                    for (var i in prop) {
                        options.append(key + "[]", prop[i]);
                    }
                }
                else
                    options.set(key, params[key]);
            }
        }
        return options.toString();
    };
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
    MainService.prototype.IsLogedIn = function () {
        var token = this.httpService.GetToken();
        var result = false;
        if (token && token.token)
            result = true;
        return result;
    };
    MainService.prototype.UserLogin = function (email, password) {
        var params = {
            email: email,
            password: password
        };
        console.log(params);
        return this.httpService.PostData('/auth/login', JSON.stringify(params));
    };
    MainService.prototype.BaseInitAfterLogin = function (data) {
        var _this = this;
        localStorage.setItem('token', data.token);
        this.httpService.BaseInitByToken(data.token);
        this.GetMe()
            .subscribe(function (user) {
            _this.me = user;
            _this.onAuthChange$.next(true);
        });
    };
    MainService.prototype.TryToLoginWithToken = function () {
        var token = localStorage.getItem('token');
        //let token = window.localStorage.getItem('token');
        if (token) {
            this.BaseInitAfterLogin(new token_model_1.TokenModel(token));
        }
    };
    MainService.prototype.Logout = function () {
        this.httpService.token = null;
        this.httpService.headers.delete('Authorization');
        this.onAuthChange$.next(false);
        localStorage.removeItem('token');
        //window.localStorage.removeItem('token');
        return this.httpService.PostData("/auth/logout", "");
    };
    /* Authentication BLOCK END */
    MainService.prototype.GetImageById = function (id) {
        return this.httpService.GetData('/images/get/' + id, "");
    };
    /* ACTIVITIES BLOCK START */
    MainService.prototype.GetAllActivities = function (params) {
        return this.httpService.GetData('/activities/get_all', this.ParamsToUrlSearchParams(params));
    };
    MainService.prototype.GetActivity = function (id) {
        return this.httpService.GetData('/activities/get/' + id, "");
    };
    MainService.prototype.CreateActivity = function (params) {
        return this.httpService.PostData('/activities/create', JSON.stringify(params));
    };
    MainService.prototype.UpdateActivity = function (id, params) {
        return this.httpService.PutData('/activities/update/' + id, JSON.stringify(params));
    };
    MainService.prototype.DeleteActivity = function (id) {
        return this.httpService.DeleteData('/activities/delete/' + id);
    };
    /* ACTIVITIES BLOCK END */
    /* BOOKINGS BLOCK START */
    MainService.prototype.GetMyBookings = function () {
        return this.httpService.GetData('/bookings/get_my_bookings', "");
    };
    MainService.prototype.GetActivityBookings = function (id) {
        return this.httpService.GetData(' /bookings/get_activity_bookings/' + id, "");
    };
    MainService.prototype.CreateBooking = function (params) {
        return this.httpService.PostData('/bookings/create', JSON.stringify(params));
    };
    MainService.prototype.ValidateBooking = function (params) {
        return this.httpService.PostData('/bookings/validate_booking', JSON.stringify(params));
    };
    MainService.prototype.UpdateBooking = function (id, params) {
        return this.httpService.PutData('/bookings/update/' + id, JSON.stringify(params));
    };
    MainService.prototype.DeleteBooking = function (id) {
        return this.httpService.DeleteData('/bookings/delete/' + id);
    };
    /* BOOKINGS BLOCK END */
    /* MESSAGES BLOCK START */
    MainService.prototype.GetAllMessages = function () {
        return this.httpService.GetData('/messages/get/', "");
    };
    MainService.prototype.GetSentMessages = function (params) {
        return this.httpService.GetData('/messages/get_sent', this.ParamsToUrlSearchParams(params));
    };
    MainService.prototype.GetReceivedMessages = function (params) {
        return this.httpService.GetData('/messages/get_received', this.ParamsToUrlSearchParams(params));
    };
    MainService.prototype.MarkMessagesAsRead = function () {
        return this.httpService.PostData('/messages/mark_read/', '');
    };
    MainService.prototype.CreateMessage = function (params) {
        return this.httpService.PostData('/messages/create', JSON.stringify(params));
    };
    /* MESSAGES BLOCK END */
    /* USERS BLOCK START */
    MainService.prototype.GetAllUsers = function (params) {
        return this.httpService.GetData('/users/get_all', this.ParamsToUrlSearchParams(params));
    };
    MainService.prototype.GetProffesionals = function (params) {
        return this.httpService.GetData('/users/get_professionals', this.ParamsToUrlSearchParams(params));
    };
    MainService.prototype.GetMe = function () {
        return this.httpService.GetData('/users/get_me', "");
    };
    MainService.prototype.CreateUser = function (params) {
        return this.httpService.PostData('/users/create', JSON.stringify(params));
    };
    MainService.prototype.UpdateUser = function (id, params) {
        return this.httpService.PutData('/users/update/', JSON.stringify(params));
    };
    MainService.prototype.UserModelToCreateUserModel = function (user) {
        var result = {
            email: user.email,
            name: user.name,
            date_of_birth: user.date_of_birth,
            gender: user.gender,
            address: (user.user_type == "professional") ? user.address : null,
            phone: (user.user_type == "professional") ? user.phone : null,
            description: (user.user_type == "professional") ? user.description : null
        };
        return result;
    };
    MainService.prototype.ChangePassword = function (old_pw, new_pw) {
        return this.httpService.PostData('/users/change_password', JSON.stringify({ old_password: old_pw, new_password: new_pw }));
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