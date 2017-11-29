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
import { AppAccessGuard } from './app.guard';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { TimepickerModule } from 'ngx-bootstrap';

import { AgmCoreModule } from '@agm/core'
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PasswordValidationDirective } from './shared/directives/pass.validator.directive';
//import { LoginModule } from 'app/login/login.module';
import { SystemModule } from './systemModule/system.module';
import { LoginComponent } from 'app/login/login.component';

import { Ng2CableModule } from 'ng2-cable';
import { LoadingModule } from 'app/shared/loading/loading.module';

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
    Ng2CableModule,
    BrowserAnimationsModule,
    //LoginModule,
    SystemModule,
    LoadingModule
  ],
  providers: [MainService, HttpModule, HttpService, AppAccessGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
