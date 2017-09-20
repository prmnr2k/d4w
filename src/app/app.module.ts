import { NgModule}      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from "@angular/router";
import {Http, HttpModule} from "@angular/http";
import { FormsModule }   from '@angular/forms';

import { AppComponent }   from './app.component';
//TODO import another components
import {MainService} from "./services/main.service";;
import { routs } from './Pages/pages.route';
import { PageModule } from './Pages/pages.module';

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
