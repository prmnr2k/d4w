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
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

import { Ng2Cable, Broadcaster } from 'ng2-cable';
import { BaseComponent } from 'app/core/base/base.component';
import { ShowHideTrigger } from 'app/shared/animations/showFade.animation';
import { element } from 'protractor';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-statistic-coworking',
  templateUrl: './StatisticCoworking.html',
  animations:[
    ShowHideTrigger
  ]
})
export class StatisticCoworkingComponent extends BaseComponent implements OnInit{
    
    CoworkingId:number;
    total_income:number = 0;
    total_visitors:number = 0;
    currency:string = 'rub';
    dates:string[] = [];
    incomes:number[] = [];
    visitors:number[] = [];
    
    models:string[] = ['Income','Visitors']
    model:string = this.models[0];
    
    isMoney:boolean = true;

    bsConfig:Partial<BsDatepickerConfig>;
    _bsRangeValue: any = this.getLastMonthDates();

    @ViewChild('mylinechart')
    private chartComponent: any;

    get bsRangeValue(): any {
      return this._bsRangeValue;
    }
   
    set bsRangeValue(v: any) {
      this._bsRangeValue = v;
    }

    public lineIncomeChartData:Array<any> = [
      {data: [], label: ''}
    ];
    
    public lineIncomeChartLabels:Array<any> = [];

    public lineIncomeChartOptions:any = {   
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,  
              min: 0  
            },
            
          }]
        },
      responsive: true     
    };

    public lineIncomeChartColors:Array<any> = [
      { 
        lineTension: 0,
        scalesTicks:2,
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgb(254, 127, 35)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)'
      }
    ];

    public lineIncomeChartLegend:boolean = false;
    public lineIncomeChartType:string = 'line';









    public lineVisitorsChartData:Array<any> = [
      {data: [], label: ''},
    ];
    
    public lineVisitorsChartLabels:Array<any> = [];

    public lineVisitorsChartOptions:any = {
      responsive: true
    };
    public lineVisitorsChartColors:Array<any> = [
      { 
        backgroundColor: 'rgba(148,159,177,0.1)',
        borderColor: 'green',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)'
      }
    ];

    public lineVisitorsChartLegend:boolean = true;
    public lineVisitorsChartType:string = 'bar';

    ngOnInit() {
      this.bsConfig = Object.assign({}, {containerClass: 'theme-default',showWeekNumbers:false});
      this.BaseInit();
    }
       
  BaseInit(){
    this.GetMe(
        ()=>{
            this.GetMyCoworking();
        }
    );
}

GetMyCoworking(){
    this.WaitBeforeLoading(
        ()=> this.service.GetAllCoworking({creator_id:this.Me.id}),
        (res)=>{
            this.CoworkingId = res[0].id;
            this.GetStatistic();
        },
        (err)=>{
            console.log(err);
        }
    );
}


    GetStatistic(){
      this.dates = [];
      this.visitors = [];
      this.incomes = [];
    
        this.service.GetCoworkingStat(this.CoworkingId, this.bsRangeValue[0], this.bsRangeValue[1]).
        subscribe((res)=>{
        
          this.total_income = res.total_income.toFixed(2);
          this.currency = res.currency;
          this.total_visitors = res.total_visitors;

        for(let income of res.income) {
           this.dates.push(income.date);
           this.incomes.push(income.income);
         }

         for(let visitor of res.visitors) {
          this.visitors.push(visitor.visitors);
        }

      
          this.lineIncomeChartLabels = this.dates;
          this.lineVisitorsChartLabels = this.dates;
          
          
          this.lineIncomeChartOptions = {   
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  stepSize:this.isMoney?null:1,
                  min: 0  
                },
                
              }]
            },
          responsive: true     
        };
          
    
       setTimeout(()=>{
         if(this.isMoney){
            this.lineIncomeChartData = [
              {data: this.incomes}
            ];
          }
          else {
            this.lineIncomeChartData = [
              {data: this.visitors}
            ];
          }
       },100);
        
    
        });
    }

   
   
    // events
    public chartClicked(e:any):void {
      console.log(e);
      var chart = this.chartComponent.chart; //Internal chart.js chart object
      console.log(chart);
    }
   
    public chartHovered(e:any):void {
      console.log(e);
    }
    
    getLastMonthDates(){
      return [this.prevMonth(new Date()),this.nextDay(new Date())];
    }
   
    nextDay(date:Date){
      let nextDay = new Date(date);
      nextDay.setDate(date.getDate()+1);
      return nextDay;
    }
    prevMonth(date:Date){
        let nextDay = new Date(date);
        nextDay.setDate(date.getDate()-30);
        return nextDay;
    }

    changedLabel(param:boolean){
      this.isMoney = param;
      this.GetMyCoworking();
    }
    hideDates(){
      this.GetMyCoworking();
    }
}
