"use strict";
var CreateActivityModel = (function () {
    function CreateActivityModel(image, title, price, num_of_bookings, address, description, calendar) {
        this.image = image;
        this.title = title;
        this.price = price;
        this.num_of_bookings = num_of_bookings;
        this.address = address;
        this.description = description;
        this.calendar = calendar;
    }
    return CreateActivityModel;
}());
exports.CreateActivityModel = CreateActivityModel;
//# sourceMappingURL=createActivity.model.js.map