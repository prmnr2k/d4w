"use strict";
var UserModel = (function () {
    function UserModel(id, email, created_at, updated_at, name, date_of_birth, image_id, user_type, gender, background_id, diploma_id, address, phone, description) {
        this.id = id;
        this.email = email;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.name = name;
        this.date_of_birth = date_of_birth;
        this.image_id = image_id;
        this.user_type = user_type;
        this.gender = gender;
        this.background_id = background_id;
        this.diploma_id = diploma_id;
        this.address = address;
        this.phone = phone;
        this.description = description;
    }
    return UserModel;
}());
exports.UserModel = UserModel;
//# sourceMappingURL=user.model.js.map