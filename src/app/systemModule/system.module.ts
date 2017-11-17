import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { LoadingModule } from 'app/shared/loading/loading.module';


@NgModule({
  declarations: [
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
    CommonModule,
    LoadingModule,
    FormsModule,
    HttpModule,
    NavbarModule,
    FooterModule,
    SidebarModule,
    LbdModule,
  ],
  providers: []
})
export class SystemModule {}
