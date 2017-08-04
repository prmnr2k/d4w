"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var http_service_1 = require("../services/http.service");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var index_1 = require("./index");
var page_guards_1 = require("./page.guards");
var discover_component_1 = require("./discover/discover.component");
var center_nav_component_1 = require("../components/center.nav/center.nav.component");
var right_nav_component_1 = require("../components/right.nav/right.nav.component");
var activity_component_1 = require("./activity/activity.component");
var index_component_1 = require("./index/index.component");
var search_component_1 = require("./search/search.component");
var user_component_1 = require("./user/user.component");
var PageModule = (function () {
    function PageModule() {
    }
    return PageModule;
}());
PageModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, forms_1.FormsModule, router_1.RouterModule],
        declarations: [
            index_1.LoginComponent, index_component_1.IndexComponent, index_1.UnauthorizedComponent,
            index_1.NotFoundComponent, discover_component_1.DiscoverComponent, search_component_1.SearchComponent,
            center_nav_component_1.CenterNavComponent, right_nav_component_1.RightNavComponent, activity_component_1.ActivityComponent,
            user_component_1.UserComponent
        ],
        exports: [
            index_1.LoginComponent, index_component_1.IndexComponent, index_1.UnauthorizedComponent,
            index_1.NotFoundComponent, discover_component_1.DiscoverComponent, search_component_1.SearchComponent,
            center_nav_component_1.CenterNavComponent, right_nav_component_1.RightNavComponent, activity_component_1.ActivityComponent,
            user_component_1.UserComponent
        ],
        providers: [http_service_1.HttpService, page_guards_1.PageAccessGuard]
    })
], PageModule);
exports.PageModule = PageModule;
//# sourceMappingURL=pages.module.js.map