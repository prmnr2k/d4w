export class ChatModel{
    constructor(
        public id?: number,
        public name?: string,
        public  last_date?: Date,
        public has_unread?: boolean
    ){}
}