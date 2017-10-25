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
import { ModalComponent } from './components/modal.component';
import { AgmCoreModule } from '@agm/core';
import { BsDatepickerModule } from 'ngx-bootstrap';
import {JsonpModule} from '@angular/http';
import { Angular2SocialLoginModule } from "angular2-social-login";


let providers = {
    "google": {
      "clientId": "407186828884-df38rqtn1sbgla2v3qu103kcjdi8l5o8.apps.googleusercontent.com"
    },
    "linkedin": {
      "clientId": "LINKEDIN_CLIENT_ID"
    },
    "facebook": {
      "clientId": "FACEBOOK_CLIENT_ID",
      "apiVersion": "<version>" //like v2.4 
    }
  };

@NgModule({
    imports:      [ 
        BrowserModule,
        RouterModule.forRoot(routs),
        PageModule,
        Angular2SocialLoginModule,
        JsonpModule ,
        HttpModule,
        FormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDZ1KosRinYSwWsttFqM68orCse2Lx-vA4',
            libraries: ["places"]
        }),
        BsDatepickerModule.forRoot()
    ],
    declarations: [ AppComponent],
    providers: [ MainService, HttpModule, ModalComponent],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }

Angular2SocialLoginModule.loadProvidersScripts(providers);