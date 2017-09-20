export  class CreateMessageModel{
    constructor(
        public title?:string,
        public body?:string,
        public to_id?:number
    ){}
}