import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FooterModule } from './shared/footer/footer.module';

import { AppComponent } from './app.component';

import { MainService } from './core/services/main.service';
import { HttpService } from './core/services/http.service';
import { PageAccessGuard } from './page.guard';
import { LoadingModule } from './shared/loading/loading.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { TimepickerModule } from 'ngx-bootstrap';

import { AgmCoreModule } from '@agm/core'
import { CommonModule } from '@angular/common';
import { PasswordValidationDirective } from './shared/directives/pass.validator.directive';
//import { LoginModule } from 'app/login/login.module';
import { SystemModule } from './systemModule/system.module';
import { LoginComponent } from 'app/login/login.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AppRoutingModule,
    LoadingModule,
    //LoginModule,
    SystemModule
  ],
  providers: [MainService, HttpModule, HttpService, PageAccessGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
