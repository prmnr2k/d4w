export class BookingModel{
    constructor(
        public id?: number,
        public coworking_id?: number,
        public user_id?: number,
        public begin_date?: string,
        public end_date?: string,
        public created_at?: Date,
        public updated_at?: Date,
        public visitors_count?: number
    ){}
}