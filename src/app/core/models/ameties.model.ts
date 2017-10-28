export class AmetiesModel{
    constructor(
        public name?:string,
        public description?: string
    ){
        if(!description)
            this.description = "";
    }
}