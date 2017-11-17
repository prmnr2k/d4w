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
import { RegistrationComponent } from './registration/registration.component';
import { EditCoworkingComponent } from './editCoworking/editCoworking.component';
import { PageAccessGuard } from './../page.guard';
import { AllCoworkingsComponent } from './allCoworkings/allCoworkings.component';
import { MyBookingsComponent } from "./myBookings/myBookings.component";
import { CoworkingComponent } from "./pageCoworking/pageCoworking.component";
import { UserRegistrationComponent } from "./userRegistration/userRegistration.component";
import { EditUserComponent } from "./editUser/editUser.component";
import { ChangePasswordComponent } from './changePassword/changePassword.component';
import { SystemComponent } from './system.component';

const routes: Routes =
[
  {path:'',component:SystemComponent, children:
    [
      { path:'', redirectTo: 'all_coworkings', pathMatch:'full' },
      { path: 'user',           component: UserComponent},
      { path: 'table',          component: TablesComponent, canActivate: [PageAccessGuard] },
      { path: 'typography',     component: TypographyComponent },
      { path: 'icons',          component: IconsComponent},
      { path: 'maps',           component: MapsComponent },
      { path: 'notifications',  component: NotificationsComponent },
      { path: 'registration', component: RegistrationComponent, canActivate: [PageAccessGuard] },
      { path: 'coworking_profile', component:EditCoworkingComponent, canActivate: [PageAccessGuard] },
      { path: 'userRegistration', component: UserRegistrationComponent, canActivate: [PageAccessGuard] },
      { path: 'all_coworkings', component:AllCoworkingsComponent},
      { path: 'my_bookings', component:MyBookingsComponent,canActivate: [PageAccessGuard]},
      { path: 'coworking/:id', component:CoworkingComponent},
      { path: 'user_profile', component: EditUserComponent, canActivate: [PageAccessGuard] },
      { path: 'userRegistration', component: UserRegistrationComponent, canActivate: [PageAccessGuard] },
      { path: 'change_password', component: ChangePasswordComponent, canActivate: [PageAccessGuard] }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class SystemRoutingModule { }
