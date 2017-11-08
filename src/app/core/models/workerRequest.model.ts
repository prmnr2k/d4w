export class WorkerRequestModel{
    constructor(
        public id?: number,
        public user_id?: number,
        public coworking_id?: number,
        public created_at?: Date,
        public updated_at?: Date
    ){}
}