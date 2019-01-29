import { CoworkingModel } from './../../../core/models/coworking.model';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MainService } from './../../../core/services/main.service';
import { BaseComponent } from 'app/core/base/base.component';
import { Component, OnInit } from '@angular/core';
import { Ng2Cable, Broadcaster } from 'ng2-cable';
import { TranslateService } from '@ngx-translate/core';
import { Base64ImageModel } from 'app/core/models/base64image.model';

@Component({
  selector: 'app-coworking-stat',
  templateUrl: './coworking-stat.component.html',
  styleUrls: ['./coworking-stat.component.scss']
})
export class CoworkingStatComponent extends BaseComponent implements OnInit {

  CoworkingId = 0;
  Coworking: CoworkingModel = new CoworkingModel();
  // Statistics: Statistic;
//  /coworkings/get/<coworking_id>
  constructor(protected service: MainService, protected router: Router, 
      private activatedRoute: ActivatedRoute, protected ng2cable: Ng2Cable, protected broadcaster: Broadcaster,public translate: TranslateService) {
      super(service,router,ng2cable,broadcaster,translate);
  }
  ngOnInit() {
    this.activatedRoute.params.forEach((params) => {
      this.CoworkingId = params["id"];
      this.GetCoworking();
    });
  }

  GetCoworking(){
    if(this.CoworkingId){
      this.service.GetCoworkingById(this.CoworkingId)
        .subscribe(
          (res) => {
            this.Coworking = res;
            if(this.Coworking.images && this.Coworking.images[0] && this.Coworking.images[0].id){
              this.GetImageById(
                this.Coworking.images[0].id,
                (img:Base64ImageModel) => {
                  if(img.base64.startsWith('data:image/jpeg;base64,'))
                    this.Coworking.image = img.base64;
                  else 
                    this.Coworking.image = 'data:image/jpeg;base64,'+img.base64;
                },
                (err) => { 
                  this.Coworking.image = './../../../../assets/img/bg-sign-in.png'; 
                }
              );
            } else {
              this.Coworking.image = './../../../../assets/img/bg-sign-in.png'; 
            }
            console.log(this.Coworking);
          }
        );
      // this.service.GetCoworkingStat(this.CoworkingId, '01.11.2017', '07.12.2017')
      //   .subscribe(
      //     (res) => {
      //       this.Statistics = res;
      //       console.log(this.Statistics);
      //     }
      //   );
    }
  }

}

// interface Statistic {
//   currency: 'руб',
//   total_income: 0,
//   total_visitors: 0,
//   income: {date: string, income: number}[]
// }