export class BookingModel{
    constructor(
        public id?: number,
        public coworking_id?: number,
        public user_id?: number,
        public begin_work?: string,
        public end_work?: string,
        public date?: Date,
        public created_at?: Date,
        public updated_at?: Date
    ){}
}