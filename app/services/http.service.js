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
var http_2 = require("@angular/http");
var token_model_1 = require("./../models/token.model");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/observable/throw");
var HttpService = (function () {
    function HttpService(http) {
        this.http = http;
        this.serverUrl = "https://patrimoine.herokuapp.com";
        this.headers = new http_2.Headers([]);
        this.token = new token_model_1.TokenModel('');
    }
    HttpService.prototype.Login = function (email, password) {
        var _this = this;
        /*let params = new URLSearchParams();
        params.set('email',email);
        params.set('password',password);*/
        var params = {
            email: email,
            password: password
        };
        if (!this.headers.has('Content-Type'))
            this.headers.append('Content-Type', 'application/json');
        return this.http.post(this.serverUrl + '/auth/login', JSON.stringify(params), { headers: this.headers })
            .map(function (resp) { return resp.json(); })
            .subscribe(function (data) {
            localStorage.setItem('token', data.token);
            console.log(data);
            if (_this.headers.has('Authorization'))
                _this.headers.delete('Authorization');
            _this.headers.append('Authorization', data.token);
            _this.token = data;
        });
    };
    HttpService.prototype.GetToken = function () {
        return this.token;
    };
    HttpService.prototype.PostData = function (method, data) {
        if (!this.headers.has('Content-Type'))
            this.headers.append('Content-Type', 'application/json');
        return this.http.post(this.serverUrl + method, data, { headers: this.headers })
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    HttpService.prototype.GetData = function (method, params) {
        if (!this.headers.has('Content-Type'))
            this.headers.append('Content-Type', 'application/json');
        return this.http.get(this.serverUrl + method + "?" + params, { headers: this.headers })
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    HttpService.prototype.PutData = function (method, data) {
        if (!this.headers.has('Content-Type'))
            this.headers.append('Content-Type', 'application/json');
        return this.http.put(this.serverUrl + method, data, { headers: this.headers })
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    HttpService.prototype.DeleteData = function (method) {
        if (!this.headers.has('Content-Type'))
            this.headers.append('Content-Type', 'application/json');
        return this.http.delete(this.serverUrl + method, { headers: this.headers })
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    return HttpService;
}());
HttpService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], HttpService);
exports.HttpService = HttpService;
//# sourceMappingURL=http.service.js.map