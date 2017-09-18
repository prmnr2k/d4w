"use strict";
var CalendarModel = (function () {
    function CalendarModel(id, date, activity_id, created_at, updated_at) {
        this.id = id;
        this.date = date;
        this.activity_id = activity_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
    return CalendarModel;
}());
exports.CalendarModel = CalendarModel;
//# sourceMappingURL=calendar.model.js.map