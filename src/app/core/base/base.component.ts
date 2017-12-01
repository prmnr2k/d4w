import { Component, OnInit, ElementRef, ViewChild, NgZone, Injectable } from '@angular/core';
import { MainService } from '../services/main.service';
import { Router, Params } from '@angular/router';
import { Ng2Cable, Broadcaster } from "ng2-cable";
import { setTimeout } from 'timers';
import { Subject } from 'rxjs/Subject';
import { Subscribable } from 'rxjs/Observable';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { error } from 'util';
import { UserModel } from 'app/core/models/user.model';
import { Base64ImageModel } from 'app/core/models/base64image.model';
import { GUID } from 'app/core/models/guide.model';
import { TokenModel } from 'app/core/models/token.model';
import { UserEnumStatus, UserEnumRole } from 'app/core/base/base.enum';



@Injectable()
export class BaseComponent{
    private ActiveProcesses:string[] = [];
    public isLoading:boolean = false;
    public UsrEnumStatus = UserEnumStatus;
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
                if(this.ActiveProcesses.length == 0){
                    this.isLoading = false;
                }
                else{
                    this.isLoading = true;
                }
            });   
    }

    protected Login(email:string,password:string,callback:(error)=>any){
        this.WaitBeforeLoading(
            ()=>this.service.UserLogin(email,password),
            (res:TokenModel)=>{
                this.service.BaseInitAfterLogin(res);
                this.router.navigate(['/system','all_coworkings']);
            },
            (err)=>{
                callback(err);
            }
        );
    }

    private GenerateProcessID(){
        let id:string = GUID.GetNewGUID();
        this.ActiveProcesses.push(id);
        this.SetLoading();
        return id;
    }

    private DeleteProcess(str:string){
        let index = this.ActiveProcesses.findIndex(x=>x == str);
        this.ActiveProcesses.splice(index,1);
        this.SetLoading();
    }

    protected GetMyData(){
        this.GetMyAccess();     
        this.GetMe();
    }

    protected GetImageById(id:number,callback:(res:any)=>any, errCallback?:(obj?:any)=>void){
        if(id){
            this.WaitBeforeLoading(
                ()=>this.service.GetImageById(id),
                (res:Base64ImageModel)=>{
                    if(callback && typeof callback == "function"){
                        callback(res);
                    }
                },
                (err)=>{
                    console.log(err);

                    if(callback && typeof callback == "function"){
                        callback(false);
                    }
                    if(errCallback && typeof errCallback == "function"){
                        errCallback();
                    }

                   

                }
            );
        }
        else{
            if(callback && typeof callback == "function"){
                callback(false);
            }
        }
    }

    protected GetMyImage(callback?:()=>any){
        this.GetImageById(
            this.Me.image_id,
            (res:Base64ImageModel)=>{
                this.MyLogo = res.base64;
                if(callback && typeof callback == "function"){
                    callback();
                }
            }
        ); 
    }

    protected ReadImages(files:any,callback?:(params?)=>any){
        for(let f of files){
            let file:File = f;
            if(!file){
               break;
            }
            let myReader:FileReader = new FileReader();
            myReader.onloadend = (e) => {
                callback(myReader.result);
            }
            myReader.readAsDataURL(file);
        }
    }


    protected GetMe(callback?:()=>any){
        this.WaitBeforeLoading(
            ()=>this.service.GetMe(),
            (res)=>{
                this.Me = res;
                this.GetMyImage(callback);
            },
            (err)=>{
                console.log(err);
                if(callback && typeof callback == "function"){
                    callback();
                }
            }
        );

    }
    
    protected GetMyAccess(callback?:(params:any)=>void){
        this.WaitBeforeLoading(
            ()=>this.service.GetMyAccess(),
            (res:any)=>{
                this.SetUserStatus(res.role);
                if(callback && typeof callback == "function"){
                    callback(res);
                }
            },
            (err)=>{
                this.SetUserStatus('');
                if(callback && typeof callback == "function"){
                     callback(false);
                }
            }
        );
    }


    private SetUserStatus(role:string){
        switch(role){
            case UserEnumRole.Creator:{
                this.userStatus = UserEnumStatus.Creator;
                break;
            }
            case UserEnumRole.Receptionist:{
                this.userStatus = UserEnumStatus.Receptionist;
                break;
            }
            case UserEnumRole.User:{
                this.userStatus = UserEnumStatus.User;
                break;
            }
            default:{
                this.userStatus = UserEnumStatus.None;
                break;
            }
        }
    }

    public Logout(){
        this.service.Logout();
    }
    

    public WaitBeforeLoading = (fun:()=>Observable<any>,success:(result?:any)=>void, err?:(obj?:any)=>void)=>{
        let process = this.GenerateProcessID();
        
        fun()
            .subscribe(
                res=>{
                    success(res);
                    this.DeleteProcess(process);
                },
                error=>{
                    if(err && typeof err == "function"){
                        err(error); 
                    }
                    this.DeleteProcess(process);
                });
    }

    protected SetLoading = () => {
        this.service.onLoadingChange$.next(true);
    }

}