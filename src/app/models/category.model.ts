export class CategoryModel{
    constructor(
        public name?:string,
        public parent?:string,
        public value?:string
    ){
        if(!name)
            this.name = "";
        if(!parent)
            this.parent = "";
        if(!value){
            this.value = this.parent+ ":" + this.name;
        }
    }
}