export class BookingModel{
    constructor(
        public id?: number,
        public activity_id?:number,
        public num_of_participants?:number,
        public is_validated?:boolean,
        public created_at?: Date,
        public updated_at?: Date,
        public user_id?: number
    ) {

    }
}