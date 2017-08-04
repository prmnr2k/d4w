
export class ActivityModel{
    constructor(
        public id:number,
        public address: string,
        public activity_type:string,
        public creation_date: Date,
        public rating: number,
        public background_url: string,
        public logo_url:string,
        public location:string,
        public title:string,
        public rules_of_security:string,
        public description: string,
        public max_bookings_per_day: number,
        public stuff_to_take: string,
        public creator: number
    ){}
}