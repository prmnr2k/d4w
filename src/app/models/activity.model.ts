import { CalendarModel } from './calendar.model';
export class ActivityModel{
    constructor(
        public id?:number,
        public image_id?:number,
        public title?:string,
        public price?:number,
        public num_of_bookings?:number,
        public address?:string,
        public detailed_address?:string,
        public description?:string,
        public created_at?:Date,
        public updated_at?:Date,
        public user_id?:number,
        public calendar?:CalendarModel[],
        public rate?:number,
        public lat?: number,
        public lng?:number,
        public dostance?:number,
        public bearing?:number,
        public user_name?:string,
        public user_image_id?:number,
        public user_description?:string

    ){}
}