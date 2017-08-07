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
var user_model_1 = require("./models/user.model");
var main_service_1 = require("./services/main.service");
var AppComponent = (function () {
    function AppComponent(mainService) {
        this.mainService = mainService;
        this.isLoggedIn = false;
        this.me = new user_model_1.UserModel(null, "", "", "", "", null, null);
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.mainService.onAuthChange$.subscribe(function (bool) {
            if (bool) {
                _this.isLoggedIn = bool;
                if (_this.isLoggedIn)
                    _this.mainService.GetMe()
                        .subscribe(function (data) {
                        console.log(JSON.stringify(data));
                        _this.me = data;
                        //console.log(this.me);
                    });
            }
        });
        this.mainService.TryToLoginWithToken();
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'sportroter',
        templateUrl: 'app/app.component.html',
    }),
    __metadata("design:paramtypes", [main_service_1.MainService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map