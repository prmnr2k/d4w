import { Component, OnInit } from '@angular/core';
import { MainService } from '../core/services/main.service';
import { Router } from '@angular/router';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    isLoggedIn: Boolean;
    userStatus:number;
}
export const ROUTES: RouteInfo[] = [
    //{ path: 'dashboard', title: 'Dashboard',  icon: 'pe-7s-graph', class: '', isLoggedIn: false },

    { path: 'coworking_profile', title: 'Coworking Profile',  icon:'pe-7s-user', class: '', isLoggedIn: true,userStatus:3 },
    { path: 'table', title: 'Coworking stat',  icon:'pe-7s-note2', class: '', isLoggedIn: true,userStatus:2 },
    { path: 'all_coworkings', title: 'Avaliable Coworkings',  icon:'pe-7s-box1', class: '', isLoggedIn: true, userStatus:0 },
    { path: 'user_profile', title: 'User Profile',  icon:'pe-7s-user', class: '', isLoggedIn: true, userStatus:1 },
    { path: 'change_password', title: 'Change Password',  icon:'pe-7s-user', class: '', isLoggedIn: true, userStatus:1 },

    //{ path: 'typography', title: 'Typography',  icon:'pe-7s-news-paper', class: '' },
    //{ path: 'icons', title: 'Icons',  icon:'pe-7s-science', class: '', isLoggedIn: false },
    //{ path: 'maps', title: 'Maps',  icon:'pe-7s-map-marker', class: '' },
    //{ path: 'notifications', title: 'Notifications',  icon:'pe-7s-bell', class: '', isLoggedIn: true }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  public isLoggedIn = false;
  public meRole = 'guest';
  constructor(private service: MainService, private router: Router) { }

  ngOnInit() {
    this.isLoggedIn = this.service.IsLogedIn();
    this.service.onAuthChange$
        .subscribe((res:boolean)=>{
            this.isLoggedIn = res;
            if(!this.isLoggedIn)
                this.router.navigate(['/login']);
        });
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    this.service.GetMyAccess()
    .subscribe((res)=>{
       
        this.meRole = res.role;
        console.log(`me role sidebar`, this.meRole);
    });
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      /*if(window.innerWidth >991){
          return false;
      }*/
      return true;
  }

  Logout(){
    
    this.service.Logout()
        .add(()=>{
            this.router.navigate(['/login']);
        })
    }
    getUserStatus(){
        let status:number = 0;
        if(this.meRole == 'creator')status = 3;
        else if(this.meRole == 'receptionist')status = 2;
        else if(this.meRole == 'user')status = 1;
        return status;
    }
}
