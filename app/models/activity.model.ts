import { UserModel } from './user.model';
export class ActivityModel{
    constructor(
        public id:number,
        public title: string,
        public picture: string,
        public rules_of_security: string,
        public begin: Date,
        public finish: Date,
        public price: number,
        public bookings_per_day: number,
        public address: string,
        public description: string,
        public created_at: Date,
        public updated_at: Date,
        public user_id: number
    ){}
}