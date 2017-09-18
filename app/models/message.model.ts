export class MessageModel{
    constructor(
        public id?: number,
        public title?: string,
        public  body?: string,
        public created_at?: Date,
        public updated_at?: Date,
        public  from_id?: number,
        public to_id?: number,
        public is_read?: boolean
    ){}
}