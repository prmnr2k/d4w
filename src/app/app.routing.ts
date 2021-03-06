import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'app/login/login.component';
import { AppAccessGuard } from 'app/app.guard';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch:'full'},
    { path: 'login',component: LoginComponent, canActivate: [AppAccessGuard]},
    { path: 'system', loadChildren: './systemModule/system.module#SystemModule'}
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
