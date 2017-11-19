export class FrontWorkingDayModel{
    constructor(
        public ru_name?:string,
        public en_name?:string,
        public weekend?:boolean,
        public start_work?:string,
        public finish_work?:string,
        public checked?:boolean,
        public nonstop?:boolean
    ){}
}