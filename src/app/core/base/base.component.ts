import { Component, OnInit, ElementRef, ViewChild, NgZone, Injectable } from '@angular/core';
import { MainService } from '../services/main.service';
import { Router } from "@angular/router";
import { Ng2Cable, Broadcaster } from "ng2-cable";
import { setTimeout } from 'timers';
import { Subject } from 'rxjs/Subject';
import { Subscribable } from 'rxjs/Observable';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { error } from 'util';
import { UserModel } from 'app/core/models/user.model';
import { Base64ImageModel } from 'app/core/models/base64image.model';



@Injectable()
export class BaseComponent{
    

    public isLoading:boolean = false;

    public isLoggedIn:boolean = false;
    public userStatus:number = 0;
    public Me:UserModel = new UserModel();
    public MyLogo:string = '';



    constructor(protected service: MainService, protected router: Router, protected ng2cable: Ng2Cable, protected broadcaster: Broadcaster) {

        this.isLoggedIn = this.service.IsLogedIn();
        if(this.isLoggedIn){
            this.ng2cable
                .subscribe('wss://d4w-api.herokuapp.com/cable?token='+this.service.getToken().token, 'BookingsChannel');
            this.GetMyData();
        }
        this.service.onAuthChange$
            .subscribe((res:boolean)=>{
                this.isLoggedIn = res;
                if(this.isLoggedIn){
                    this.GetMyData();
                    this.ng2cable
                        .subscribe('wss://d4w-api.herokuapp.com/cable?token='+this.service.getToken().token, 'BookingsChannel');
                }
                else
                    this.router.navigate(['/login']);
            });
        
        
        this.service.onLoadingChange$
            .subscribe((val:boolean)=>{
                this.isLoading = val;
            });

        
    }

    protected GetMyData(){
        
        this.GetMyAccess();
        this.service.GetMe()
            .subscribe((res)=>{
                this.Me = res;
                if(this.Me.image_id){
                    this.service.GetImageById(this.Me.image_id)
                        .subscribe((img:Base64ImageModel)=>{
                            this.MyLogo = img.base64;
                        });
                }
            });
    }

    protected GetMyAccess(){
        this.service.GetMyAccess()
            .subscribe((res)=>{
                this.SetUserStatus(res.role);
            },
            err=>{
                this.SetUserStatus('');
            });
    }


    private SetUserStatus(role:string){
        switch(role){
            case 'creator':{
                this.userStatus = 3;
                break;
            }
            case 'receptionist':{
                this.userStatus = 2;
                break;
            }
            case 'user':{
                this.userStatus = 1;
                break;
            }
            default:{
                this.userStatus = 0;
                break;
            }
        }
    }

    public Logout(){
        this.service.Logout();
    }
    

    public WaitBeforeLoading = (fun:()=>Observable<any>,success:(result?:any)=>void, err?:(obj?:any)=>void)=>{
        this.SetLoading(true);
        fun()
            .subscribe(
                res=>{
                    success(res);
                },
                error=>{
                    if(err && typeof err == "function")
                        err(error);
                });
    }

    public WaitBeforeDataGetting = (fun:()=>Observable<any>,success:(result?:any)=>any,err?:(obj?:any)=>any)=>{
        return fun()
            .subscribe(
                res=>{
                    success(res);
                },
                error=>{
                    if(err && typeof err == "function")
                        err(error);
                }
            );
    }

    protected SetLoading = (bool:boolean) => {
        this.service.onLoadingChange$.next(bool);
    }

}