"use strict";
var ActivityModel = (function () {
    function ActivityModel(id, image_id, title, price, num_of_bookings, address, description, created_at, updated_at, user_id, calendar) {
        this.id = id;
        this.image_id = image_id;
        this.title = title;
        this.price = price;
        this.num_of_bookings = num_of_bookings;
        this.address = address;
        this.description = description;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.user_id = user_id;
        this.calendar = calendar;
    }
    return ActivityModel;
}());
exports.ActivityModel = ActivityModel;
//# sourceMappingURL=activity.model.js.map