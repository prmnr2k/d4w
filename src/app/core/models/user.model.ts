export class UserModel{
    constructor(
        public id?: number,
        public email?: string,
        public first_name?: string,
        public last_name?: string,
        public phone?: string,
        public image_id?: number,
        public address?: string,
        public coworking_id?: number,
        public created_at?: Date,
        public updated_at?: Date
    ){}
}