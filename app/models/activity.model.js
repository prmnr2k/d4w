"use strict";
var ActivityModel = (function () {
    function ActivityModel(id, title, picture, rules_of_security, begin, finish, price, bookings_per_day, address, description, created_at, updated_at, user_id) {
        this.id = id;
        this.title = title;
        this.picture = picture;
        this.rules_of_security = rules_of_security;
        this.begin = begin;
        this.finish = finish;
        this.price = price;
        this.bookings_per_day = bookings_per_day;
        this.address = address;
        this.description = description;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.user_id = user_id;
    }
    return ActivityModel;
}());
exports.ActivityModel = ActivityModel;
//# sourceMappingURL=activity.model.js.map