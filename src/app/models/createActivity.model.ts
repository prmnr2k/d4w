export class CreateActivityModel{
    constructor(
        public image?: string,
        public title?: string,
        public price?: number,
        public num_of_bookings?:number,
        public address?: string,
        public detailed_address?:string,
        public description?: string,
        public calendar?: Date[],
        public rate?:number,
        public lat?: number,
        public lng?:number,
        public public_lat?: number,
        public public_lng?:number,
        public category?: string,
        public sub_category?: string

    ){

    }
}