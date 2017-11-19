import { WorkingDayModel } from './workingDay.model';
import { AmetiesModel } from './ameties.model';

export class CreateCoworkingModel{
    constructor(
        public email?:string,
        public password?: string,
        public password_confirmation?:string,
        public full_name?: string,
        public short_name?:string,
        public address?:string,
        public description?: string,
        public contacts?: string,
        public additional_info?: string,
        public price?: number,
        public capacity?: number,
        public working_days?: WorkingDayModel[],
        public amenties?: AmetiesModel[],
        public images?: string[],
        public first_name?: string,
        public last_name?: string,
        public phone?: string,
        public image?:string
    ){}
}