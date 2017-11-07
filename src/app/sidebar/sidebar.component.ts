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
}
export const ROUTES: RouteInfo[] = [
    //{ path: 'dashboard', title: 'Dashboard',  icon: 'pe-7s-graph', class: '', isLoggedIn: false },
    { path: 'coworking_profile', title: 'Coworking Profile',  icon:'pe-7s-user', class: '', isLoggedIn: true },
    { path: 'table', title: 'Coworking stat',  icon:'pe-7s-note2', class: '', isLoggedIn: true },
    { path: 'user_profile', title: 'User Profile',  icon:'pe-7s-user', class: '', isLoggedIn: true },
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
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  }

  Logout(){
    this.service.Logout()
        .subscribe(()=>{
            this.router.navigate(['/login']);
        })
    }
}
