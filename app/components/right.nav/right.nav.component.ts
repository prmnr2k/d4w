import { Component, OnInit, Injectable } from '@angular/core';
import { MainService } from '../../services/main.service';

@Component({
    selector: "right-nav",
    templateUrl: "./app/components/right.nav/right.nav.component.html"
})

export class RightNavComponent implements OnInit{

    isLoggedIn:boolean = false;
    //me: UserModel = new UserModel(null,"","","","",null,null); 
    constructor(
        private mainService: MainService){}
    ngOnInit(){
        this.mainService.onAuthChange$.subscribe(bool => {
            if(bool){
                this.isLoggedIn = bool;
                if(this.isLoggedIn)
                    this.mainService.GetMe()
                        /*.subscribe((data:UserModel)=>{
                            console.log(JSON.stringify(data));
                            this.me = data;
                            //console.log(this.me);
                        });*/
            }
        });
    }
}