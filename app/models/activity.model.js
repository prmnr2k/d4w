"use strict";
var ActivityModel = (function () {
    function ActivityModel(id, address, activity_type, creation_date, rating, background_url, logo_url, location, title, rules_of_security, description, max_bookings_per_day, stuff_to_take, creator) {
        this.id = id;
        this.address = address;
        this.activity_type = activity_type;
        this.creation_date = creation_date;
        this.rating = rating;
        this.background_url = background_url;
        this.logo_url = logo_url;
        this.location = location;
        this.title = title;
        this.rules_of_security = rules_of_security;
        this.description = description;
        this.max_bookings_per_day = max_bookings_per_day;
        this.stuff_to_take = stuff_to_take;
        this.creator = creator;
    }
    return ActivityModel;
}());
exports.ActivityModel = ActivityModel;
//# sourceMappingURL=activity.model.js.map