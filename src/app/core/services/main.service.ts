import { Injectable } from "@angular/core";
import { Http, URLSearchParams } from '@angular/http';
import {TokenModel} from "./../models/token.model";
import { HttpService } from './http.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';
import { UserModel } from '../models/user.model';
import { CheckboxModel } from '../models/checkbox.model';
import { CreateCoworkingModel } from '../models/createCoworking.model';
import { AmetiesModel } from '../models/ameties.model';
import { CoworkingModel } from '../models/coworking.model';
import { WorkingDayModel } from '../models/workingDay.model';
import { CreateUserModel } from "app/core/models/createUser.model";
import { BookingModel } from '../models/booking.model';
import { FrontWorkingDayModel } from '../models/frontWorkingDays.model';
import { UserEnumStatus } from "app/core/base/base.enum";

@Injectable()
export class MainService{
    public onAuthChange$: Subject<boolean>;
    public me: UserModel;
    public onLoadingChange$: Subject<boolean>;
    //public pushNotif:NotificationsComponent = new NotificationsComponent();
    constructor(private http: HttpService, private router: Router){
        this.onAuthChange$ = new Subject();
        this.onAuthChange$.next(false);
        this.onLoadingChange$ = new Subject();
        this.onLoadingChange$.next(false);
        this.me = new UserModel();
    }

    /* Authentication BLOCK START */
    IsLogedIn():boolean{
        let token = this.http.GetToken();
        if(!token || !token.token)
            return false;
        return true;
    }
    getToken()
    {
        return this.http.GetToken();
    }

    UserLogin(email:string, password:string){
        let params = {
            email: email,
            password: password
        };
        return this.http.PostData('/auth/login',JSON.stringify(params));
    }

    SetupLocalUserStatus(status){
        try{
            localStorage.setItem('userStatus',status+"");
        }
        catch(err){
            console.log(err);
        }
    }

    GetLocalUserStatus():number{
        try{
            return +localStorage.getItem('userStatus');
        }
        catch(err){
            console.log(err);
            return UserEnumStatus.None;
        }
    }

    BaseInitAfterLogin(data:TokenModel){
        localStorage.setItem('token',data.token);
        this.http.BaseInitByToken(data.token);
        this.GetMe()
            .subscribe((user:UserModel)=>{
                    this.me = user;
                    this.onAuthChange$.next(true);
                });
    }

    TryToLoginWithToken()
    {
        let token = localStorage.getItem('token');
        if(token)
        {
            this.BaseInitAfterLogin(new TokenModel(token));
        }
    }

    ClearSession(){
        this.http.token = null;
        this.http.headers.delete('Authorization');
        this.onAuthChange$.next(false);
        localStorage.removeItem('token');
        console.log('localStorage.removeItem deleted');
    }
    Logout(){
        return this.http.PostData("/auth/logout","")
            .subscribe((res:any)=>{
                this.ClearSession();
                this.SetupLocalUserStatus(UserEnumStatus.None);
            });
            
    }

    
    /* Authentication BLOCK END */

    GetImageById(id:number){
        return this.http.GetData('/images/get/'+id,"");
    }

    /* USERS BLOCK START */

    CreateUser(data: CreateUserModel){
        return this.http.PostData('/users/create',JSON.stringify(data));
    }
    UpdateMe(data: CreateUserModel){
        return this.http.PutData('/users/update_me',JSON.stringify(data));
    }

    GetMe(){
        return this.http.GetData('/users/get_me',"");
    }

    ChangeUserPassword(params:any){
        return this.http.PostData('/users/change_password',JSON.stringify(params));
    }

    DeleteMe(){
        return this.http.DeleteData('/users/delete_me');
    }

    GetUserById(id:number){
        return this.http.GetData('/users/get/'+id,"");
    }
    GetMyAccess(){
        return this.http.GetData('/access/get_my_access',"");
    }
    GetMyAccessStatus(){
        let status:string =`guest`;
        this.GetMyAccess()
        .subscribe((res)=>{
            status = res.role;
            return status;
        });
      return status;
    }

   

    UserModelToCreateUserModel(input:UserModel){
        let result = new CreateUserModel();
        if(input){
            result.first_name = input.first_name?input.first_name:'';
            result.last_name = input.last_name?input.last_name:'';
            result.phone = input.phone?input.phone:'';
            result.email = input.email?input.email:'';
            result.address = input.address?input.address:'';
            result.image = '';
        }


        return result;

    }

    public rateUser(user_id:number,score:string){
        const data = {
            user_id: user_id,
            score: score
        }
        return this.http.PostData('/users/rate',JSON.stringify(data));
        
    }

    public getMyRates(){
        
        return this.http.GetData('/users/get_my_rates','');
        
    }

    public checkUserByEmail(emailUser){
    
        return this.http.GetData('/users/check_email','email='+emailUser);

    }

    GetExendRequests(id){
        return this.http.GetData('/bookings/get_extend_requests/'+id,'');
    } 

    /* USERS BLOCK END */

    /* Coworkings BLOCK START */
    CreateCoworking(data: CreateCoworkingModel){
        return this.http.PostData('/coworkings/create',JSON.stringify(data));
    }

    UpdateCoworking(id:number,data:CreateCoworkingModel){
        return this.http.PutData('/coworkings/update/'+id,JSON.stringify(data));
    }

    GetAllCoworking(params?:any){
        return this.http.GetData('/coworkings/get_all',this.ParamsToUrlSearchParams(params));
    }
    GetAllPaged(params?:any){
        return this.http.GetData('/coworkings/get_all_paged',this.ParamsToUrlSearchParams(params));
    }

    GetCoworkingById(id:number){
        return this.http.GetData('/coworkings/get/'+id,"");
    }
    GetCoworkingWorkersRequest(id:number){
        return this.http.GetData('/coworkings/get_access_requests/'+id,"");
    }
    GetCoworkingWorkers(id:number){
        return this.http.GetData('/coworkings/get_accessed_users/'+id,"");
    }

    GetCoworkingStat(id:number,begin:string,end:string){
        let params={
            begin_date: begin,
            end_date: end
        }
        return this.http.GetData('/coworkings/get_stat/'+id,this.ParamsToUrlSearchParams(params));
    }


    RateCoworking(coworking_id:number,user_id:number,score:string){
        const data = {
            coworking_id: coworking_id,
            user_id: user_id,
            score: score
        }
        console.log(`cowRateData`,data);
        return this.http.PostData('/coworkings/rate',JSON.stringify(data));
        
    }
    CoworkingModelToCreateCoworkingModel(input:CoworkingModel){
        let result = new CreateCoworkingModel();
        if(input){
            result.email = input.email?input.email:'';
            result.full_name = input.full_name?input.full_name:'';
            result.short_name = input.short_name?input.short_name:'';
            result.address = input.address?input.address:'';
            result.description = input.description?input.description:'';
            result.contacts = input.contacts?input.contacts:'';
            result.additional_info = input.additional_info?input.additional_info:'';
            result.price = input.price?input.price:0;
            result.capacity = input.capacity?input.capacity:0;
            result.working_days = input.working_days?input.working_days:[new WorkingDayModel('Monday','09:00','22:00')];
            result.amenties = input.amenties?input.amenties:[];
        }
        result.images = [];


        return result;

    }
    /* Coworkings BLOCK END */


    /* BOOKINGS BLOCK START */
    GetBookingsByCwr(id:number, data?:any){
        /*
        data = {
            date:''
        }
        */ 
        return this.http.GetData('/coworkings/get_bookings/'+id,this.ParamsToUrlSearchParams(data));
    }

    GetBookingById(id:number){
        return this.http.GetData('/bookings/get/'+id,'');
    }

    ExtendBooking(id:number, time:string){
        let params={
            'booking_id':id,
            'extend_time':time
        }
        return this.http.PostData('/bookings/extend_booking',JSON.stringify(params));
    }

    ApplyExtendRequest(id:number){
        let params={
            'request_id':id,
        }
        return this.http.PostData('/bookings/apply_extend_request',JSON.stringify(params));
    }

    BookingCreate(book:BookingModel){
        return this.http.PostData('/bookings/create',JSON.stringify(book));
    }
    GetMyBookings(){
        return this.http.GetData('/users/get_my_bookings','');
    }

    CancelBooking(id:number){
        return this.http.PostData('/bookings/cancel_booking/', JSON.stringify({'booking_id':id}));
    }

    DeleteBooking(id:number){
        return this.http.DeleteData('/bookings/delete/'+id);
    }

    public ValidateBooking(booking_id:any){
        return this.http.PostData('/bookings/validate_booking',JSON.stringify(booking_id));
    }

    public bookingConfirmChangeStart(booking_id:number){
        const data = {
            booking_id: booking_id
        }
        return this.http.PostData('/bookings/confirm_visit',JSON.stringify(data));
    }
    public bookingConfirmChangeEnd(booking_id:number){
        const data = {
            booking_id: booking_id
        }
       
        return this.http.PostData('/bookings/confirm_finish',JSON.stringify(data));
    }
    
    /* BOOKING BLOCK END */


    /* RECEPTIONIST BLOCK START */

    RequestReception(id:number){
        return this.http.PostData('/access/request_access',JSON.stringify({'coworking_id':id}));
    }
    RequestAccess(id:number){
        return this.http.PostData('/access/apply_request',JSON.stringify({'request_id':id}));
    }
    RequestAccessEmail(id:number,email:string){
        let params={
            'coworking_id':id,
            'email':email
        }
        return this.http.PostData('/access/grant_reception_access',JSON.stringify(params));
    }
    RemoveAccess(id:number){
        return this.http.PostData('/access/remove_user_access',JSON.stringify({'user_id':id}));
    }
    RemoveAccessRequest(id:number){
        return this.http.DeleteData('/access/remove_request/'+id);
    }


   
    /* RECEPTIONIST BLOCK END */




    /* DATA BLOCK START */


    CheckErrMessage(body:any):string{
        let RegErrMsg = '';
            if(body.email) {
                for(let i of body.email) {
                    if(i == "INVALID")
                        RegErrMsg += "Email contains invalid symbols! ";
                    if(i == "ALREADY_TAKEN")
                        RegErrMsg += "Email is already registered! ";
                    if(i == "EMPTY_FIELD")
                        RegErrMsg += "Please input email! ";
                    if(i == "TOO_LONG")
                        RegErrMsg += "Email is too long! ";
                }
            }
            if(body.old_password) {
                for(let i of body.old_password) {
                    if(i == "NOT_MATCHED")
                        RegErrMsg += "Old password is incorrect! ";
                }
            }
            if(body.phone) {
                for(let i of body.phone) {
                    if(i == "INVALID")
                        RegErrMsg += "Phone contains invalid symbols! ";
                }
            }
            if(body.password) {
                for(let i of body.password) {
                    if(i == "TOO_SHORT")
                        RegErrMsg += "Password is too short. Password must contain more than 6 symbols! ";
                    if(i == "TOO_LONG")
                        RegErrMsg += "Password is too long! ";
                    if(i == "EMPTY_FIELD")
                        RegErrMsg += "Please input password! ";
                }
            }
            if(body.password_confirmation) {
                for(let i of body.password_confirmation) {
                    if(i == "NOT_MACHED")
                        RegErrMsg += "Confirmed passwrod must be the same as password! ";
                    if(i == "EMPTY_FIELD")
                        RegErrMsg += "Please confirm password! ";
                }
            }
            if(body.capacity) {
                for(let i of body.capacity) {
                    if(i == "LIMIT_REACHED")
                        RegErrMsg += "Limit of places reached! ";
                }
            }
            if(body.images) {
                for(let i of body.images) {
                    if(i == "LIMIT_REACHED")
                        RegErrMsg += "Limit of images reached! ";
                }
            }
        return RegErrMsg;
    }

    CheckErrMessageRu(body:any):string{
        let RegErrMsg = '';
        if(this.GetCurrentLang() == 'en'){
            if(body.email) {
                for(let i of body.email) {
                    if(i == "INVALID")
                        RegErrMsg += "Email contains invalid symbols! ";
                    if(i == "ALREADY_TAKEN")
                        RegErrMsg += "Email is already registered! ";
                    if(i == "EMPTY_FIELD")
                        RegErrMsg += "Please input email! ";
                    if(i == "TOO_LONG")
                        RegErrMsg += "Email is too long! ";
                }
            }
            if(body.old_password) {
                for(let i of body.old_password) {
                    if(i == "NOT_MATCHED")
                        RegErrMsg += "Old password is incorrect! ";
                }
            }
            if(body.phone) {
                for(let i of body.phone) {
                    if(i == "INVALID")
                        RegErrMsg += "Phone contains invalid symbols! ";
                }
            }
            if(body.password) {
                for(let i of body.password) {
                    if(i == "TOO_SHORT")
                        RegErrMsg += "Password is too short. Password must contain more than 6 symbols! ";
                    if(i == "TOO_LONG")
                        RegErrMsg += "Password is too long! ";
                    if(i == "EMPTY_FIELD")
                        RegErrMsg += "Please input password! ";
                }
            }
            if(body.password_confirmation) {
                for(let i of body.password_confirmation) {
                    if(i == "NOT_MACHED")
                        RegErrMsg += "Confirmed passwrod must be the same as password! ";
                    if(i == "EMPTY_FIELD")
                        RegErrMsg += "Please confirm password! ";
                }
            }
            if(body.capacity) {
                for(let i of body.capacity) {
                    if(i == "LIMIT_REACHED")
                        RegErrMsg += "Limit of places reached! ";
                }
            }
            if(body.images) {
                for(let i of body.images) {
                    if(i == "LIMIT_REACHED")
                        RegErrMsg += "Limit of images reached! ";
                }
            }
        }
        else {
            if(body.email) {
                for(let i of body.email) {
                    if(i == "INVALID")
                        RegErrMsg += "Неверный формат email!";
                    if(i == "ALREADY_TAKEN")
                        RegErrMsg += "Данный еmail уже зарегистрирован! ";
                    if(i == "EMPTY_FIELD")
                        RegErrMsg += "Пожалуйста введите email! ";
                    if(i == "TOO_LONG")
                        RegErrMsg += "Email слишком длинный! ";
                }
            }
            if(body.old_password) {
                for(let i of body.old_password) {
                    if(i == "NOT_MATCHED")
                        RegErrMsg += "Старый пароль введен неправильно! ";
                }
            }
            if(body.phone) {
                for(let i of body.phone) {
                    if(i == "INVALID")
                        RegErrMsg += "Телефон содержит некорректные символы! ";
                }
            }
            if(body.password) {
                for(let i of body.password) {
                    if(i == "TOO_SHORT")
                        RegErrMsg += "Пароль слишком короткий. Длина пароля должна быть больше 6 символов! ";
                    if(i == "TOO_LONG")
                        RegErrMsg += "Пароль слишком длинный! ";
                    if(i == "EMPTY_FIELD")
                        RegErrMsg += "Пожалуйста введите пароль! ";
                }
            }
            if(body.password_confirmation) {
                for(let i of body.password_confirmation) {
                    if(i == "NOT_MACHED")
                        RegErrMsg += "Подтверждающий пароль должен совпадать с паролем! ";
                    if(i == "EMPTY_FIELD")
                        RegErrMsg += "Пожалуйста введите подтверждающий пароль! ";
                }
            }
            if(body.capacity) {
                for(let i of body.capacity) {
                    if(i == "LIMIT_REACHED")
                        RegErrMsg += "Достигнут лимит мест! ";
                }
            }
            if(body.images) {
                for(let i of body.images) {
                    if(i == "LIMIT_REACHED")
                        RegErrMsg += "Достигнут лимит картинок! ";
                }
            }
        }
        return RegErrMsg;
    }

    ParamsToUrlSearchParams(params:any):string{
        let options = new URLSearchParams();

        for(let key in params){
            let prop:any = params[key];
            if(prop){
                if( prop instanceof Array){
                    for(let i in prop){
                        if(prop[i])
                            options.append(key+"[]",prop[i]);
                    }
                }
                else
                    options.set(key,params[key]);
            }
        }
        return options.toString();
    }

    public GetAllDays(){
        return [
            new FrontWorkingDayModel('Понедельник','Monday'),
            new FrontWorkingDayModel('Вторник','Tuesday'),
            new FrontWorkingDayModel('Среда','Wednesday'),
            new FrontWorkingDayModel('Четверг','Thursday'),
            new FrontWorkingDayModel('Пятница','Friday'),
            new FrontWorkingDayModel('Суббота','Saturday',true),
            new FrontWorkingDayModel('Воскресенье','Sunday',true)
        ];
    }
    public GetFrontDaysByWorkingDays(input:WorkingDayModel[]):FrontWorkingDayModel[]{
        let result:FrontWorkingDayModel[] = this.GetAllDays();
        for(let item of input){
            let index = result.findIndex(x => x.en_name == item.day);
            if(index > -1){
                result[index].checked = true;
                result[index].start_work = item.begin_work;
                result[index].finish_work = item.end_work;
            }
        }
        return result;
    }

    public GetWorkingDaysFromFront(days:FrontWorkingDayModel[]):WorkingDayModel[]{
        let result:WorkingDayModel[] = [];

        for(let i of days){
            if(i.checked)
                result.push(new WorkingDayModel(i.en_name,i.start_work,i.finish_work));
        }
        return result;
    }

    public GetCheckedWorkingDaysName(days:FrontWorkingDayModel[]):string[]{
        let result:string[] = [];
        for(let item of days){
            if(item.checked){
              result.push(item.en_name);
            }
        }
        return result;
    }

    public GetAllAmenties(){
        return [
            new CheckboxModel("Coffee","coffee", "Кофе"),
            //new CheckboxModel("Printing","printing", "Печать"),
            new CheckboxModel("Free printing","free_printing", "Бесплатная печать"),
            /*new CheckboxModel("Conference room","conference_room", "Комната для конференций"),
            new CheckboxModel("Outdoor space","outdoor_space", "Место на улице"),
            new CheckboxModel("Extra monitor","extra_monitor", "Дополнительный монитор"),
            new CheckboxModel("Nap room","nap_room", "Комната для сна"),
            new CheckboxModel("Pet friendly","pet_friendly", "Можно с домашними животными"),
            new CheckboxModel("Kitchen","kitchen", "Кухня"),
            new CheckboxModel("Bike storage","bike_storage", "Место для велосипедов"),*/
            new CheckboxModel("Free parking","free_parking", "Бесплатная парковка"),
            new CheckboxModel("Parking","parking", "Парковка"),
            new CheckboxModel("Snacks","snacks", "Закуски")
            /*new CheckboxModel("Whiteboards","whiteboards", "Настенные доски"),
            new CheckboxModel("Standing desk","standing_desk", "Переносные доски"),
            new CheckboxModel("Mail service","mail_service", "Почтовый сервис"),
            new CheckboxModel("Phone booth","phone_booth", "Телефонная будка")*/
        ];
    }

    public GetValuesOfCheckedCB(input:CheckboxModel[]){
        let result:AmetiesModel[] = [];
        for(let i of input){
            if(i.checked)
                result.push(new AmetiesModel(i.value));
        }
        return result;
    }

    public SetCheckedCB(cb:CheckboxModel[], amets:AmetiesModel[]){
        if(amets){
            for(let item of amets){
                let index = cb.findIndex(x=>x.value == item.name);
                if(cb[index]){
                    cb[index].checked = true;
                }
            }
        }
        return cb;
    }

    

    

    /* DATA BLOCK END */

    AsyncPost(){
        let data =
        {
            message:"msg"
        }
        return this.http.PostData('/users/kek',JSON.stringify(data));
    }

    
    SendSmsClickatell(num_mob:string,text:string)
    {
        console.log(`old send Сlickatell`);
          var xhr = new XMLHttpRequest();
          xhr.open("GET", "https://platform.clickatell.com/messages/http/send?apiKey=2SrHPOF5S9Ws8QHc5oUG5g==&to="+num_mob+"&content="+text, true);
          xhr.onreadystatechange = function(){
              if (xhr.readyState == 4 && xhr.status == 200){
                  console.log('success')
              }
          };
          xhr.send();
    }
    SetCurrentLang(lang:string){
        localStorage.setItem('lang',lang);
    }
    GetCurrentLang(){
        let lang = localStorage.getItem('lang');
        
        if(!lang){
            lang = 'ru';
            this.SetCurrentLang(lang);
        }
        return lang;
    }

}