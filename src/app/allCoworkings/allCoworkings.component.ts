import { Component, OnInit } from '@angular/core';
import { MainService } from '../core/services/main.service';
import { Router, Params } from '@angular/router';
import { CoworkingModel } from '../core/models/coworking.model';
import { CreateCoworkingModel } from '../core/models/createCoworking.model';
import { CheckboxModel } from '../core/models/checkbox.model';
import { WorkingDayModel } from '../core/models/workingDay.model';
import { TokenModel } from '../core/models/token.model';
import { UserModel } from '../core/models/user.model';
import { Base64ImageModel } from '../core/models/base64image.model';

@Component({
  selector: 'all-coworkings',
  templateUrl: './allCoworkings.component.html',
  styleUrls:["./allCoworkings.component.css"]
})
export class AllCoworkings implements OnInit {
    
    RegistrationErr = false;
    isLoading = true;
    Coworkings:CoworkingModel[] = [];
    Images:string[] = [];
    Params = {
      limit:10,
      offset:0,
      description:'',
      full_name:'',
      address:'',
      additional_info:'',
      begin_work:'',
      end_work:'',
      date:null
    };
    constructor(private service: MainService, private router: Router) { }

    ngOnInit() 
    {
      this.service.GetAllCoworking()
      .subscribe((cwr:CoworkingModel[])=>{
          console.log(cwr);
          this.Coworkings = cwr;
          for(let item of cwr){
            if(item.images && item.images[0]){
              this.service.GetImageById(item.images[0].id)
              .subscribe((image:Base64ImageModel)=>{
                  this.Images['act'+item.id] = image.base64;
              });}}
              this.isLoading = false; 
            });
          
  
    }

    CoworkingSearch() {
      this.service.GetAllCoworking(this.Params)
      .subscribe((cwr:CoworkingModel[])=>{
          console.log(cwr);
          this.Coworkings = cwr;
          for(let item of cwr){
            if(item.images && item.images[0]){
              this.service.GetImageById(item.images[0].id)
              .subscribe((image:Base64ImageModel)=>{
                  this.Images['act'+item.id] = image.base64;
              });}}
              this.isLoading = false; 
            });
    }
}


