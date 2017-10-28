import { WorkingDayModel } from './workingDay.model';
import { AmetiesModel } from './ameties.model';
import { Base64ImageModel } from './base64image.model';
export class CoworkingModel{
    constructor(
        public id?: number,
        public full_name?: string,
        public short_name?: string,
        public email?:string,
        public phone?:string,
        public lat?: number,
        public lng?: number,
        public description?: string,
        public contacts?: string,
        public address?:string,
        public additional_info?: string,
        public price?: number,
        public capacity?: number,
        public working_days?: WorkingDayModel[],
        public amenties?: AmetiesModel[],
        public images?: Base64ImageModel[],
        public creator_id?:number,
        public created_at?: Date,
        public updated_at?: Date
    ){}
}