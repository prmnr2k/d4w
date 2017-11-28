import { Component, OnInit } from '@angular/core';
import { MainService } from '../../core/services/main.service';
import { Router } from '@angular/router';
import { BaseComponent } from 'app/core/base/base.component';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    userStatus:number;
}
export const ROUTES: RouteInfo[] = [
    //{ path: 'dashboard', title: 'Dashboard',  icon: 'pe-7s-graph', class: '', isLoggedIn: false },
    { path: '/system/coworking_profile', title: 'Coworking Profile',  icon:'../assets/img/Tune.svg', class: '', userStatus:3 },
    { path: '/system/table', title: 'Coworking stat',  icon:'../assets/img/Chair.svg', class: '',  userStatus:2 },
    { path: '/system/all_coworkings', title: 'Avaliable Coworkings',  icon:'../assets/img/avail-cow.svg', class: '', userStatus:0  }
    //{ path: 'typography', title: 'Typography',  icon:'pe-7s-news-paper', class: '' },
    //{ path: 'icons', title: 'Icons',  icon:'pe-7s-science', class: '', isLoggedIn: false },
    //{ path: 'maps', title: 'Maps',  icon:'pe-7s-map-marker', class: '' },
    //{ path: 'notifications', title: 'Notifications',  icon:'pe-7s-bell', class: '', isLoggedIn: true }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent extends BaseComponent implements OnInit {
  menuItems: any[];


  ngOnInit() {
    
    this.menuItems = ROUTES.filter(menuItem => menuItem);

  }  
}
