import { NgModule }      from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpService} from '../services/http.service';
import { FormsModule }   from '@angular/forms';

import { RouterModule } from "@angular/router";

import {LoginComponent,
        UnauthorizedComponent, NotFoundComponent} from './index';
import { PageAccessGuard } from './page.guards';
import { DiscoverComponent } from './discover/discover.component';
import { CenterNavComponent } from '../components/center.nav/center.nav.component';
import { RightNavComponent } from '../components/right.nav/right.nav.component';
import { ActivityComponent } from './activity/activity.component';
import { IndexComponent } from './index/index.component';
import { SearchComponent } from './search/search.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { CreateActivityComponent } from './createActivity/createActivity.component';

@NgModule({
    imports:      [ CommonModule,FormsModule,RouterModule ],
    declarations: [
        LoginComponent, IndexComponent,UnauthorizedComponent,
        NotFoundComponent, DiscoverComponent, SearchComponent,
        CenterNavComponent,RightNavComponent,ActivityComponent,
        UserComponent,RegisterComponent,CreateActivityComponent
    ],
    exports: [
        LoginComponent, IndexComponent, UnauthorizedComponent,
        NotFoundComponent,DiscoverComponent, SearchComponent,
        CenterNavComponent,RightNavComponent,ActivityComponent,
        UserComponent,RegisterComponent,CreateActivityComponent
    ],
    providers: [HttpService, PageAccessGuard]
})

export class PageModule { }