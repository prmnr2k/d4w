import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../../systemModule/sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { MainService } from '../../core/services/main.service';
import { Router } from '@angular/router';
import { UserModel } from 'app/core/models/user.model';
import { Base64ImageModel } from '../../core/models/base64image.model';

@Component({
    // moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit{
    public listTitles: any[];
    location: Location;
    public toggleButton: any;
    public sidebarVisible: boolean;
    public isLoggedIn = false;
    public meRole:string = 'guest';
    public Me:UserModel = new UserModel();
    public Image:string = '';
    constructor(location: Location,  private element: ElementRef, private service: MainService, private router: Router) {
      this.location = location;
          this.sidebarVisible = false;
    }

    ngOnInit(){
        this.isLoggedIn = this.service.IsLogedIn();
        this.service.onAuthChange$
            .subscribe((res:boolean)=>{
                this.isLoggedIn = res;
                if(!this.isLoggedIn){
                    this.Me = new UserModel();
                    this.Image = '';
                    this.router.navigate(['/login']);
                }
                else{
                    this.GetUserInfo();
                }
                   
            });
        this.GetUserInfo();
        this.service.GetMyAccess()
            .subscribe((meR)=>{
                this.meRole = meR.role;
            });
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    }

    GetUserInfo()
    {
        this.service.GetMe()
        .subscribe((user:UserModel)=>{
            this.Me = user;
            if(this.Me.image_id){
                this.service.GetImageById(this.Me.image_id)
                    .subscribe((img:Base64ImageModel)=>{
                        this.Image = img.base64;
                    })
            } 
        })
    }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.split('/').pop();
      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }

    Navigate(params:string[]){
        this.router.navigate(params);
    }

    Logout(){
        this.service.Logout()
            .add(()=>{
                this.router.navigate(['/login']);
            })
    }
}
