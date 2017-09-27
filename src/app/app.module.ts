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

@NgModule({
    imports:      [ 
        BrowserModule,
        RouterModule.forRoot(routs),
        PageModule,
        HttpModule,
        FormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDZ1KosRinYSwWsttFqM68orCse2Lx-vA4'
        }),
        BsDatepickerModule.forRoot()
    ],
    declarations: [ AppComponent],
    providers: [ MainService, HttpModule, ModalComponent],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
