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
var user_model_1 = require("../../models/user.model");
var UserComponent = (function () {
    function UserComponent(router, service, activatedRoute) {
        this.router = router;
        this.service = service;
        this.activatedRoute = activatedRoute;
        this.IsLoading = true;
        this.User = new user_model_1.UserModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        this.isMe = false;
        this.MenuItem = "edit";
    }
    UserComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.params.forEach(function (params) {
            var userId = params["id"];
            console.log(userId);
            //TODO: REWRITE THIS HARDCODE
            if (userId == 'me') {
                _this.isMe = true;
                _this.service.GetMe()
                    .then(function (result) {
                    _this.User = result;
                    console.log("ME");
                    console.log(_this.User);
                });
            }
            else {
                _this.service.GetUserById(userId)
                    .then(function (result) {
                    _this.User = result;
                    console.log(_this.User);
                });
            }
        });
    };
    UserComponent.prototype.SetMenuItem = function (item) {
        this.MenuItem = item;
    };
    return UserComponent;
}());
UserComponent = __decorate([
    core_1.Component({
        selector: "user",
        templateUrl: "./app/Pages/user/user.component.html",
        providers: [http_service_1.HttpService]
    }),
    __metadata("design:paramtypes", [router_1.Router,
        main_service_1.MainService,
        router_1.ActivatedRoute])
], UserComponent);
exports.UserComponent = UserComponent;
//# sourceMappingURL=user.component.js.map