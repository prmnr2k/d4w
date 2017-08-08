"use strict";
var UserModel = (function () {
    function UserModel(id, user_type, // client/pro
        gender, // male/female
        birth_day, profile_picture, background, gallery, email, name, phone, diploma_photo, activity_description, password, created_at, updated_at) {
        this.id = id;
        this.user_type = user_type;
        this.gender = gender;
        this.birth_day = birth_day;
        this.profile_picture = profile_picture;
        this.background = background;
        this.gallery = gallery;
        this.email = email;
        this.name = name;
        this.phone = phone;
        this.diploma_photo = diploma_photo;
        this.activity_description = activity_description;
        this.password = password;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
    return UserModel;
}());
exports.UserModel = UserModel;
//# sourceMappingURL=user.model.js.map