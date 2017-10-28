export class CreateUserModel{
    constructor(
        public email?: string,
        public password?: string,
        public password_confirmation?: string,
        public first_name?: string,
        public last_name?: string,
        public phone?: string,
        public image?: string,
        public address?: string
    ){}
}