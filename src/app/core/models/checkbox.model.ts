export class CheckboxModel{
    constructor(
        public name?:string,
        public value?:string,
        public checked?:boolean
    ){
        if(!value)
            this.value = name;
        if(!checked)
            this.checked = false;
    }
}