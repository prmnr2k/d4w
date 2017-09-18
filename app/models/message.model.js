"use strict";
var MessageModel = (function () {
    function MessageModel(id, title, body, created_at, updated_at, from_id, to_id, is_read) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.from_id = from_id;
        this.to_id = to_id;
        this.is_read = is_read;
    }
    return MessageModel;
}());
exports.MessageModel = MessageModel;
//# sourceMappingURL=message.model.js.map