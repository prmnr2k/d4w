import { Component, OnInit } from '@angular/core';
import { MainService } from '../core/services/main.service';
import { Router } from '@angular/router';
import { CoworkingModel } from '../core/models/coworking.model';
import { CreateCoworkingModel } from '../core/models/createCoworking.model';
import { CheckboxModel } from '../core/models/checkbox.model';
import { WorkingDayModel } from '../core/models/workingDay.model';
import { TokenModel } from '../core/models/token.model';
import { UserModel } from '../core/models/user.model';
import { Base64ImageModel } from '../core/models/base64image.model';

@Component({
  selector: 'page-coworking',
  templateUrl: './pageCoworking.component.html'
})
export class Coworking implements OnInit {
   
    constructor(private service: MainService, private router: Router) { }

    ngOnInit() 
    {
       
        
    }

    

}
