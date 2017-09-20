"use strict";
var BookingModel = (function () {
    function BookingModel(id, activity_id, num_of_participants, is_validated, created_at, updated_at, user_id) {
        this.id = id;
        this.activity_id = activity_id;
        this.num_of_participants = num_of_participants;
        this.is_validated = is_validated;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.user_id = user_id;
    }
    return BookingModel;
}());
exports.BookingModel = BookingModel;
//# sourceMappingURL=booking.model.js.map