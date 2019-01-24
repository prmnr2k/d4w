import { AdminStatComponent } from './admin-stat/admin-stat.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { LoadingModule } from 'app/shared/loading/loading.module';
import { NavbarModule } from 'app/shared/navbar/navbar.module';
import { FooterModule } from 'app/shared/footer/footer.module';
import { BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { TablesComponent } from './tables/tables.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RegistrationComponent } from './registration/registration.component';
import { EditCoworkingComponent } from './editCoworking/editCoworking.component';
import { EditUserComponent } from './editUser/editUser.component';
import { UserRegistrationComponent } from './userRegistration/userRegistration.component';
import { PasswordValidationDirective } from 'app/shared/directives/pass.validator.directive';
import { AllCoworkingsComponent } from './allCoworkings/allCoworkings.component';
import { CoworkingComponent } from './pageCoworking/pageCoworking.component';
import { MyBookingsComponent } from './myBookings/myBookings.component';
import { ChangePasswordComponent } from './changePassword/changePassword.component';
import { SidebarModule } from './sidebar/sidebar.module';
import { SystemRoutingModule } from './system.routing';
import { LbdModule } from 'app/systemModule/lbd/lbd.module';
import { SystemComponent } from 'app/systemModule/system.component';
import { SystemAccessGuard } from './system.guard';
import { IdBookingComponent } from './idBooking/idBooking.component';
import { TextMaskModule } from 'angular2-text-mask';
import { TranslateModule } from '@ngx-translate/core';
import { StatisticCoworkingComponent } from './statisticCoworking/statisticCoworking.component';
import { ChartsModule } from 'ng2-charts';
import { StarRatingModule } from 'angular-star-rating';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HalfMapComponent } from './halfMap/halfMap.component';
import { CoworkingStatComponent } from './admin-stat/coworking-stat/coworking-stat.component';


@NgModule({
  declarations: [
    HomeComponent,
    UserComponent,
    TablesComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    RegistrationComponent, 
    EditCoworkingComponent,
    UserRegistrationComponent,
    EditUserComponent,
    PasswordValidationDirective,
    AllCoworkingsComponent,
    MyBookingsComponent,
    CoworkingComponent,
    EditUserComponent,
    ChangePasswordComponent,
    SystemComponent,
    IdBookingComponent,
    StatisticCoworkingComponent,
    HalfMapComponent,
    AdminStatComponent,
    CoworkingStatComponent
  ],
  imports: [
    ChartsModule,
    CommonModule,
    LoadingModule,
    FormsModule,
    HttpModule,
    NavbarModule,
    FooterModule,
    TextMaskModule,
    SidebarModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyC2BkBEmbEb1Shxzr9wtZScnUCC-SQZKhA',
      apiKey: "AIzaSyDNxl1cQw-cqFs5sv0vGJYmW_Ew5qWKNCc",
      libraries: ["places"]
    }),
    ReactiveFormsModule,
    SystemRoutingModule,
    LbdModule,
    TranslateModule,
    StarRatingModule.forRoot()
  ],
  providers: [ SystemAccessGuard]
})
export class SystemModule {}

