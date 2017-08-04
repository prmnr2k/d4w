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
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/observable/throw");
require("rxjs/Rx");
var Subject_1 = require("rxjs/Subject");
var MainService = (function () {
    function MainService(httpService, router) {
        this.httpService = httpService;
        this.router = router;
        this.onAuthChange$ = new Subject_1.Subject();
        this.onAuthChange$.next(false);
    }
    MainService.prototype.GetAllAds = function (params) {
        /*return AdsPromise
            .then(Ads => Ads.filter(x => x.description.includes(text) &&
                ((category.length > 0)?(x.sub_category == category):true))
            );*/
        var options = new http_1.URLSearchParams();
        for (var key in params) {
            options.set(key, params[key]);
        }
        return this.httpService.GetData('/ads/all', options.toString());
    };
    MainService.prototype.GetAdsById = function (id) {
        /*return AdsPromise
            .then(Ads => Ads.find(x => x.id == id));*/
        return this.httpService.GetData('/ads/info/' + id, "");
    };
    MainService.prototype.CreateAd = function (title, desc) {
        var params = { title: title, description: desc };
        /*return AdsPromise
            .then(Ads => Ads.push(new AdsModel(id+1,title,desc,"",this.me.id,1,1,null,null,"fintech",[""],[""])));*/
        return this.httpService.PostData('/ads/create', JSON.stringify(params));
    };
    MainService.prototype.DeleteAd = function (ad) {
        return this.httpService.DeleteData('/ads/delete/' + ad.id);
    };
    MainService.prototype.UpdateAd = function (id, title, desc) {
        var ad = { title: title, description: desc };
        var params = new http_1.URLSearchParams();
        params.set('ad', JSON.stringify(ad));
        return this.httpService.PutData('/ads/update/' + id, JSON.stringify(params))
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    MainService.prototype.GetAllUsers = function (params) {
        var options = new http_1.URLSearchParams();
        for (var key in params) {
            options.set(key, params[key]);
        }
        /*return this.httpService.GetData('/users/all',params).toArray<UserModel>();*/
        return this.httpService.GetData('/users/all', options.toString());
    };
    MainService.prototype.GetUserById = function (id) {
        return this.httpService.GetData('/users/info/' + id, "");
    };
    MainService.prototype.GetMe = function () {
        return this.httpService.GetData('/users/my_info', "");
    };
    MainService.prototype.CreateUser = function (user) {
        var params = {
            user: user,
            expertises: ["placement"],
            agrements: ["CJA"]
        };
        console.log(JSON.stringify(params));
        return this.httpService.PostData('/users/create', JSON.stringify(params)).toPromise();
    };
    MainService.prototype.CreateUserCompany = function (user, company, expertises, agrements) {
        var params = {
            user: user,
            company: company,
            expertises: expertises,
            agrements: agrements
        };
        console.log(JSON.stringify(params));
        return this.httpService.PostData('/users/create', JSON.stringify(params)).toPromise();
    };
    MainService.prototype.UpdateUser = function (user) {
        return this.httpService.PutData('/users/update', JSON.stringify(user)).toPromise();
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
    MainService.prototype.GetAllNews = function (params) {
        var options = new http_1.URLSearchParams();
        for (var key in params) {
            options.set(key, params[key]);
        }
        return this.httpService.GetData('/news/all', options.toString());
    };
    MainService.prototype.GetNewsById = function (id) {
        return this.httpService.GetData('/news/info/' + id, "");
    };
    MainService.prototype.CreateNews = function (title, descr) {
        var params = { title: title, description: descr };
        /*return AdsPromise
            .then(Ads => Ads.push(new AdsModel(id+1,title,desc,"",this.me.id,1,1,null,null,"fintech",[""],[""])));*/
        return this.httpService.PostData('/news/create', JSON.stringify(params));
    };
    MainService.prototype.UpdateNews = function (id, title, descr) {
        var params = { ad: { title: title, description: descr } };
        return this.httpService.PutData('/news/update/' + id, JSON.stringify(params));
    };
    MainService.prototype.DeleteNews = function (id) {
        return this.httpService.DeleteData('/news/delete/' + id);
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