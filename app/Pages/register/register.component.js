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
var main_service_1 = require("./../../services/main.service");
var RegisterComponent = (function () {
    function RegisterComponent(router, mainService) {
        this.router = router;
        this.mainService = mainService;
    }
    RegisterComponent.prototype.ngOnInit = function () {
    };
    RegisterComponent.prototype.RegisterPro = function (gender, bd, email, full_name, phone, password, description) {
        var _this = this;
        this.mainService.CreateUser('pro', gender, bd, "./production/images/man.jpg", "source/images/userspace.png", null, full_name, email, phone, null, description, password)
            .then(function (result) {
            console.log(JSON.parse(localStorage.getItem('UserList')));
            _this.router.navigate(["login"]);
        });
    };
    RegisterComponent.prototype.RegisterClient = function (gender, bd, email, full_name, phone, password) {
        var _this = this;
        this.mainService.CreateUser('client', gender, bd, "./production/images/man.jpg", null, null, full_name, email, phone, null, null, password)
            .then(function (result) {
            _this.router.navigate(["login"]);
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