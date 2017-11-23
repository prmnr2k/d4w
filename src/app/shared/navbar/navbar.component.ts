import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../../systemModule/sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { MainService } from '../../core/services/main.service';
import { Router } from '@angular/router';
import { UserModel } from 'app/core/models/user.model';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { BaseComponent } from '../../core/base/base.component';

@Component({
    // moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent extends BaseComponent implements OnInit{

    ngOnInit(){
    }

    Navigate(params:string[]){
        this.router.navigate(params);
    }

}
