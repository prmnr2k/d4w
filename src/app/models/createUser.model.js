"use strict";
var CreateUserModel = (function () {
    function CreateUserModel(email, password, name, image, date_of_birth, gender, user_type, address, phone, description, diploma, background) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.image = image;
        this.date_of_birth = date_of_birth;
        this.gender = gender;
        this.user_type = user_type;
        this.address = address;
        this.phone = phone;
        this.description = description;
        this.diploma = diploma;
        this.background = background;
        if (!gender)
            this.gender = 'male';
        if (!user_type)
            this.user_type = 'client';
    }
    return CreateUserModel;
}());
exports.CreateUserModel = CreateUserModel;
//# sourceMappingURL=createUser.model.js.map