import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'app/login/login.component';
import { PageAccessGuard } from 'app/page.guard';


const routes: Routes =[
    { path: '',component: LoginComponent},
    { path: 'system', loadChildren: './systemModule/system.module#SystemModule', canActivate: [PageAccessGuard] }
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
