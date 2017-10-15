export class CreateUserModel{
    constructor(
        public email?: string,
        public password?: string,
        public name?: string,
        public short_name?: string,
        public image?: string,
        public date_of_birth?: Date,
        public gender?:string,
        public user_type?: string,
        public address?: string,
        public phone?: string,
        public description?: string,
        public diploma?: string,
        public background?: string
    ){
        if(!gender)
            this.gender = 'male';
        if(!user_type)
            this.user_type = 'client';
    }

}