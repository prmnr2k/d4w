import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "app/login/login.component";
import { LoadingModule } from "app/shared/loading/loading.module";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";



@NgModule({
    declarations:[
        LoginComponent,
    ],
    imports:[
        CommonModule,
        LoadingModule,
        FormsModule,
        HttpModule
    ],
    providers:[]
})
export class LoginModule{}