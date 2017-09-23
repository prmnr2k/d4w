export class CommentModel{
    constructor(
        public id?:number,
        public user_id?:number,
        public activity_id?:number,
        public title?:string,
        public body?:string,
        public created_at?:Date,
        public updated_at?:Date
    ){}
}