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

export const routs = [
    { path:"", pathMatch : "full",component:IndexComponent },
    { path:"discover", component:DiscoverComponent},
    { path:"activity/:id",component:ActivityComponent},
    {path:"search",component: SearchComponent},
    {path:"users/:id",component:UserComponent},
    {path:"login", component: LoginComponent},
    {path:"registration",component: RegisterComponent},
    {path:"create_activity",component: CreateActivityComponent},
    { path: "401", component: UnauthorizedComponent},
    { path: "404", component: NotFoundComponent},
    {path: "**", component:NotFoundComponent}
];