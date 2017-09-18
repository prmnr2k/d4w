
export class UserModel{ 
    constructor( 
    public id?:number, 
    public email?:string, 
    public created_at?: Date, 
    public updated_at?: Date, 
    public name?:string, 
    public date_of_birth?:Date, 
    public image_id?:number, 
    public user_type?:string, 
    public gender?: string, 
    public background_id?: number, 
    public diploma_id?:number, 
    public address?: string, 
    public phone?:string, 
    public description?:string 
    ){ 
    }
}