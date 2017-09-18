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
var createUser_model_1 = require("../../models/createUser.model");
var RegisterComponent = (function () {
    function RegisterComponent(router, mainService) {
        this.router = router;
        this.mainService = mainService;
        this.RegisterUser = new createUser_model_1.CreateUserModel();
    }
    RegisterComponent.prototype.ngOnInit = function () {
    };
    RegisterComponent.prototype.Register = function () {
        console.log(this.RegisterUser);
        if (this.RegisterUser.user_type == 'client') {
            this.RegisterUser.address = null;
            this.RegisterUser.phone = null;
            this.RegisterUser.description = null;
            this.RegisterUser.diploma = null;
            this.RegisterUser.background = null;
        }
        this.mainService.CreateUser(this.RegisterUser)
            .subscribe(function (result) {
            console.log(result);
        }, function (err) {
            console.log(err);
        });
    };
    RegisterComponent.prototype.changeListener = function (field, $event) {
        this.readThis(field, $event.target);
    };
    RegisterComponent.prototype.readThis = function (field, inputValue) {
        var _this = this;
        var file = inputValue.files[0];
        if (!file)
            return;
        var myReader = new FileReader();
        myReader.onloadend = function (e) {
            if (field == 'user_logo') {
                _this.RegisterUser.image = myReader.result;
            }
            else if (field == 'diploma') {
                _this.RegisterUser.diploma = myReader.result;
            }
            else {
                _this.RegisterUser.background = myReader.result;
            }
        };
        myReader.readAsDataURL(file);
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