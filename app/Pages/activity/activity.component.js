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
var activity_model_1 = require("../../models/activity.model");
var user_model_1 = require("../../models/user.model");
var ActivityComponent = (function () {
    function ActivityComponent(router, service, activatedRoute) {
        this.router = router;
        this.service = service;
        this.activatedRoute = activatedRoute;
        this.IsLoading = true;
        this.Activity = new activity_model_1.ActivityModel(null, null, null, null, null, null, null, null, null, null, null, null, null);
        this.User = new user_model_1.UserModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
    }
    ActivityComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.params.forEach(function (params) {
            var actId = params["id"];
            console.log(actId);
            _this.service.GetActivityById(actId)
                .then(function (result) {
                _this.Activity = result;
                _this.service.GetUserById(_this.Activity.user_id)
                    .then(function (res) {
                    _this.User = res;
                });
            });
        });
    };
    return ActivityComponent;
}());
ActivityComponent = __decorate([
    core_1.Component({
        selector: "activity",
        templateUrl: "./app/Pages/activity/activity.component.html",
        providers: [http_service_1.HttpService]
    }),
    __metadata("design:paramtypes", [router_1.Router,
        main_service_1.MainService,
        router_1.ActivatedRoute])
], ActivityComponent);
exports.ActivityComponent = ActivityComponent;
//# sourceMappingURL=activity.component.js.map