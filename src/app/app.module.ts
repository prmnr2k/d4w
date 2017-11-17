import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FooterModule } from './shared/footer/footer.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { LbdModule } from './lbd/lbd.module';

import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { TablesComponent } from './tables/tables.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { MainService } from './core/services/main.service';
import { HttpService } from './core/services/http.service';

import { RegistrationComponent } from './registration/registration.component';
import { EditCoworkingComponent } from './editCoworking/editCoworking.component';
import { PageAccessGuard } from './page.guard';
import { LoadingModule } from './shared/loading/loading.module';
import { UserRegistrationComponent } from "app/userRegistration/userRegistration.component";
import { AllCoworkings } from "./allCoworkings/allCoworkings.component";
import { MyBookings } from "./myBookings/myBookings.component";
import { Coworking } from "./pageCoworking/pageCoworking.component";
import { BsDatepickerModule } from 'ngx-bootstrap';
import { TimepickerModule } from 'ngx-bootstrap';
import { EditUserComponent } from "app/editUser/editUser.component";
import { ChangePasswordComponent } from './changePassword/changePassword.component';

import { AgmCoreModule } from '@agm/core'
import { CommonModule } from '@angular/common';
import { PasswordValidationDirective } from './shared/directives/pass.validator.directive';
import { LoginModule } from 'app/login/login.module';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserComponent,
    TablesComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    RegistrationComponent, 
    EditCoworkingComponent,
    UserRegistrationComponent,
    EditUserComponent,
    PasswordValidationDirective,
    AllCoworkings,
    MyBookings,
    Coworking,
    EditUserComponent,
    ChangePasswordComponent


  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NavbarModule,
    FooterModule,
    SidebarModule,
    RouterModule,
    AppRoutingModule,
    LbdModule,
    LoadingModule,
    LoginModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBB_1_ksAJ62AGdcPCnE-eQBIRTev320ys'
    })
  ],
  providers: [MainService, HttpModule, HttpService, PageAccessGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
