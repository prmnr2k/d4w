
import {PageAccessGuard} from "./page.guards";
import { IndexComponent } from './index/index.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { NotFoundComponent } from './notfound/notfound.component';
import { DiscoverComponent } from './discover/discover.component';
import { ActivityComponent } from './activity/activity.component';
import { SearchComponent } from './search/search.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CreateActivityComponent } from './createActivity/createActivity.component';
import { EditActivityComponent } from './editActivity/editActivity.component';

export const routs = [
    { path:"", pathMatch : "full",component:IndexComponent, canActivate: [PageAccessGuard] },
    { path:"discover", component:DiscoverComponent, canActivate: [PageAccessGuard]},
    { path:"activity/:id",component:ActivityComponent, canActivate: [PageAccessGuard]},
    {path:"search",component: SearchComponent, canActivate: [PageAccessGuard]},
    {path:"users/:id",component:UserComponent, canActivate: [PageAccessGuard]},
    {path:"login", component: LoginComponent, canActivate: [PageAccessGuard]},
    {path:"registration",component: RegisterComponent, canActivate: [PageAccessGuard]},
    {path:"create_activity",component: CreateActivityComponent, canActivate: [PageAccessGuard]},
    { path: "401", component: UnauthorizedComponent, canActivate: [PageAccessGuard]},
    { path: "404", component: NotFoundComponent, canActivate: [PageAccessGuard]},
    { path: "edit_act/:id", component:EditActivityComponent, canActivate: [PageAccessGuard]},
    {path: "**", component:NotFoundComponent, canActivate: [PageAccessGuard]}
];