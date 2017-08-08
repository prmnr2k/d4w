import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';

@Component({
    selector: "center-nav",
    templateUrl: "./app/components/center.nav/center.nav.component.html"
})

export class CenterNavComponent implements OnInit{

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