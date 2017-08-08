
export class UserModel{
    constructor(
        public id: number,
        public user_type: string, // client/pro
        public gender: string, // male/female
        public birth_day : Date,
        public profile_picture:string,
        public background: string,
        public gallery: string[],
        public email: string, 
        public name: string,
        public phone: string,
        public diploma_photo: string,
        public activity_description: string,
        public password: string,
        public created_at: Date,
        public updated_at: Date
    ){
    }

}