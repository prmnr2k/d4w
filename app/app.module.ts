import { NgModule}      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from "@angular/router";
import {Http, HttpModule} from "@angular/http";
import { FormsModule }   from '@angular/forms';

import { AppComponent }   from './app.component';
import { routs, PageModule  } from "./Pages/index";
//TODO import another components
import {MainService} from "./services/main.service";
import { RightNavComponent } from './components/right.nav/right.nav.component';
import { CenterNavComponent } from './components/center.nav/center.nav.component';

@NgModule({
    imports:      [ 
        BrowserModule,
        RouterModule.forRoot(routs),
        PageModule,
        HttpModule,
        FormsModule
    ],
    declarations: [ AppComponent],
    providers: [ MainService, HttpModule],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }