export class CreateBookingModel{
    constructor(
        public activity_id?: number,
        public num_of_participants?:number,
        public date?: Date 
    ){
        if(!num_of_participants){
            this.num_of_participants = 1;
        }

    }
}