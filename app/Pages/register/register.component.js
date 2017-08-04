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
var router_1 = require("@angular/router");
var http_service_1 = require("../../services/http.service");
var index_1 = require("./../index");
var index_2 = require("./../index");
var main_service_1 = require("./../../services/main.service");
var RegisterComponent = (function () {
    function RegisterComponent(router, mainService) {
        this.router = router;
        this.mainService = mainService;
    }
    RegisterComponent.prototype.ngOnInit = function () {
    };
    RegisterComponent.prototype.RegisterUser = function (email, password, fname, lname, phone) {
        var _this = this;
        var user = new index_1.RegisterUserModel(email, password, fname, lname, phone);
        console.log(JSON.stringify(user));
        this.mainService.CreateUser(user)
            .then(function (x) {
            _this.router.navigate(['login']);
        });
    };
    RegisterComponent.prototype.RegisterUserCompany = function (email, password, fname, lname, phone, cname, caddress, coaddress, cemail, cphone, worktime, companyid, description, links, c_type, subcategory, expertises, agrements) {
        var _this = this;
        var user = new index_1.RegisterUserModel(email, password, fname, lname, phone);
        var company = new index_2.RegisterCompanyModel(cname, caddress, coaddress, cemail, cphone, worktime, companyid, description, links, c_type, subcategory);
        console.log('AAAAAAAAAAAAAA');
        console.log(expertises);
        console.log(JSON.stringify(user));
        this.mainService.CreateUserCompany(user, company, expertises, agrements)
            .then(function (x) {
            _this.router.navigate(['login']);
        });
    };
    return RegisterComponent;
}());
RegisterComponent = __decorate([
    core_1.Component({
        selector: "ads",
        templateUrl: "app/Pages/register/register.component.html",
        providers: [http_service_1.HttpService]
    }),
    __metadata("design:paramtypes", [router_1.Router,
        main_service_1.MainService])
], RegisterComponent);
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map