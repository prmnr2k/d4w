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
var main_service_1 = require("./../services/main.service");
var router_1 = require("@angular/router");
var core_1 = require("@angular/core");
var PageAccessGuard = (function () {
    function PageAccessGuard(service, router) {
        this.service = service;
        this.router = router;
    }
    PageAccessGuard.prototype.canActivate = function (route, state) {
        if (!this.service.httpService.headers.has('Authorization')) {
            this.router.navigate(["401"]);
            return false;
        }
        return true;
    };
    return PageAccessGuard;
}());
PageAccessGuard = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [main_service_1.MainService, router_1.Router])
], PageAccessGuard);
exports.PageAccessGuard = PageAccessGuard;
//# sourceMappingURL=page.guards.js.map