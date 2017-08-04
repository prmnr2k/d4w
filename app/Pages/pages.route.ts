import {PageAccessGuard} from "./page.guards";
import { IndexComponent } from './index/index.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { NotFoundComponent } from './notfound/notfound.component';
import { DiscoverComponent } from './discover/discover.component';
import { ActivityComponent } from './activity/activity.component';
import { SearchComponent } from './search/search.component';
import { UserComponent } from './user/user.component';

export const routs = [
    { path:"", pathMatch : "full",component:IndexComponent },
    { path:"discover", component:DiscoverComponent},
    { path:"activity",component:ActivityComponent},
    {path:"search",component: SearchComponent},
    {path:"user",component:UserComponent},
    { path: "401", component: UnauthorizedComponent},
    { path: "404", component: NotFoundComponent},
    {path: "**", component:NotFoundComponent}
];