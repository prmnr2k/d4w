import { Component, OnInit } from '@angular/core';
import { MainService } from '../core/services/main.service';
import { Router,ActivatedRoute } from '@angular/router';
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
  RegistrationErr = false;
  isLoading = true;
  RegErrMsg = '';
  Coworking:CoworkingModel = new CoworkingModel();
  Days:string[] = [];
  AmetiesCB: CheckboxModel[] = []; 
  Me:UserModel = new UserModel();
  meRole:string = null;
  CoworkingId:number = 0;
  
  constructor(private service: MainService, private router: Router, 
  private activatedRoute: ActivatedRoute) { }

  ngOnInit() 
  {
    this.activatedRoute.params.forEach((params) => {
    this.CoworkingId = params["id"];
    });

    
    this.service.GetCoworkingById(this.CoworkingId)
    .subscribe((cwr:CoworkingModel)=>{
        this.Coworking = cwr;
        //console.log(`me = `,this.Me);
        
        this.service.GetMyAccess()
        .subscribe((res)=>{
          this.meRole = res.role;
          console.log(`role:`,this.meRole);
        });
        this.isLoading = false;
  });
          
  }

}


