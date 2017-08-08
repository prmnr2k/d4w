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
var CreateActivityComponent = (function () {
    function CreateActivityComponent(router, activatedRoute, service) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.service = service;
    }
    CreateActivityComponent.prototype.ngOnInit = function () {
    };
    CreateActivityComponent.prototype.OnCreateActivityButtonClick = function (address, logo, title, rules, begin, finish, price, descr, bookings) {
        var _this = this;
        this.service.CreateActivity(address, './production/images/surfer.jpg', title, rules, begin, finish, price, descr, bookings)
            .then(function (result) {
            _this.service.GetAllActivities()
                .then(function (res) {
                var act = res.find(function (x) { return x.title == title && x.description == descr && x.price == price; });
                _this.router.navigate(['/activity', act.id]);
            });
        });
    };
    return CreateActivityComponent;
}());
CreateActivityComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: "createActivity",
        templateUrl: "./createActivity.component.ts",
        providers: [http_service_1.HttpService]
    }),
    __metadata("design:paramtypes", [router_1.Router,
        router_1.ActivatedRoute,
        main_service_1.MainService])
], CreateActivityComponent);
exports.CreateActivityComponent = CreateActivityComponent;
//# sourceMappingURL=createActivity.component.js.map