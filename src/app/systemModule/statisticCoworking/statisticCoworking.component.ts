import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../core/services/main.service';
import { Router } from '@angular/router';
import { CheckboxModel } from '../../core/models/checkbox.model';
import { TokenModel } from '../../core/models/token.model';
import { UserModel } from '../../core/models/user.model';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { CreateUserModel } from "app/core/models/createUser.model";
import { NgForm, FormControl } from '@angular/forms';

import { SystemAccessGuard } from './../system.guard';


import { Ng2Cable, Broadcaster } from 'ng2-cable';
import { BaseComponent } from 'app/core/base/base.component';
import { ShowHideTrigger } from 'app/shared/animations/showFade.animation';
import { element } from 'protractor';


@Component({
  selector: 'app-statistic-coworking',
  templateUrl: './StatisticCoworking.html',
  animations:[
    ShowHideTrigger
  ]
})
export class StatisticCoworkingComponent extends BaseComponent implements OnInit{
    
    ngOnInit() {
        /*
        this.WaitBeforeLoading(
            ()=>...,
            (res:any)=>{
              
            },
            (err)=>{
               
            });*/
    }
   

}
