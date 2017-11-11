export class RateModel{
    constructor(
        public id?:number,
        public rated_by?:number,
        public user_id?:number,
        public score?:string,
        public created_at?:Date,
        public updated_at?:Date
    ){}
}