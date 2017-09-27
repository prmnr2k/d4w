import { NgModule }      from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpService} from '../services/http.service';
import { FormsModule }   from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

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
import { EditActivityComponent } from './editActivity/editActivity.component';
import { ModalComponent } from '../components/modal.component';
import { BsDatepickerModule } from 'ngx-bootstrap';

@NgModule({
    imports:      [ 
        CommonModule,
        FormsModule,
        RouterModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDZ1KosRinYSwWsttFqM68orCse2Lx-vA4'
        }),
        BsDatepickerModule.forRoot()
    ],
    declarations: [
        LoginComponent, IndexComponent,UnauthorizedComponent,
        NotFoundComponent, DiscoverComponent, SearchComponent,
        ActivityComponent, UserComponent,RegisterComponent,
        CreateActivityComponent,EditActivityComponent,ModalComponent
    ],
    exports: [
        LoginComponent, IndexComponent, UnauthorizedComponent,
        NotFoundComponent,DiscoverComponent, SearchComponent,
        ActivityComponent,UserComponent,RegisterComponent,
        CreateActivityComponent,EditActivityComponent,ModalComponent
    ],
    providers: [HttpService, PageAccessGuard]
})

export class PageModule { }