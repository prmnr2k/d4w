import { NgModule }      from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpService} from '../services/http.service';
import { FormsModule }   from '@angular/forms';

import { RouterModule } from "@angular/router";
import { PageAccessGuard } from './page.guards';
import { DiscoverComponent } from './discover/discover.component';
import { ActivityComponent } from './activity/activity.component';
import { IndexComponent } from './index/index.component';
import { SearchComponent } from './search/search.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { CreateActivityComponent } from './createActivity/createActivity.component';
import { LoginComponent } from './login/login.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { NotFoundComponent } from './notfound/notfound.component';

@NgModule({
    imports:      [ CommonModule,FormsModule,RouterModule ],
    declarations: [
        LoginComponent, IndexComponent,UnauthorizedComponent,
        NotFoundComponent, DiscoverComponent, SearchComponent,
        ActivityComponent, UserComponent,RegisterComponent,
        CreateActivityComponent
    ],
    exports: [
        LoginComponent, IndexComponent, UnauthorizedComponent,
        NotFoundComponent,DiscoverComponent, SearchComponent,
        ActivityComponent,UserComponent,RegisterComponent,
        CreateActivityComponent
    ],
    providers: [HttpService, PageAccessGuard]
})

export class PageModule { }