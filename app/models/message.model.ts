export class MessageModel{
    constructor(
        public text:string,
        public sender: number,
        public recipient: number
    ){}
}