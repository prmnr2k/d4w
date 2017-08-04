
export class UserModel{
    constructor(
        public id: number,
        public email:string, 
        public first_name: string,
        public last_name: string,
        public phone: string,
        public created_at: Date,
        public updated_at: Date
    ){
        /*if(first_name == null)
            this.first_name = "";
        if(last_name  == null)
            this.last_name = "";
        if(phone == null)
            this.phone = "";
        if(email == null)
            this.email = "";*/
        

    }

}