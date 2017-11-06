import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { TablesComponent } from './tables/tables.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { EditCoworkingComponent } from './editCoworking/editCoworking.component';
import { PageAccessGuard } from './page.guard';
import { UserRegistrationComponent } from "app/userRegistration/userRegistration.component";

const routes: Routes =[
    { path: 'user',           component: UserComponent},
    { path: 'table',          component: TablesComponent, canActivate: [PageAccessGuard] },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent},
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent},
    { path: '',          redirectTo: 'table', pathMatch: 'full'},
    { path: 'login', component: LoginComponent , canActivate: [PageAccessGuard] },
    { path: 'registration', component: RegistrationComponent, canActivate: [PageAccessGuard] },
    { path: 'coworking_profile', component:EditCoworkingComponent, canActivate: [PageAccessGuard] },
    { path: 'userRegistration', component: UserRegistrationComponent, canActivate: [PageAccessGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
  providers: []
})
export class AppRoutingModule { }
