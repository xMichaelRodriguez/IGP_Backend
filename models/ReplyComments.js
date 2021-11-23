const mongoose = require("mongoose");
const { Schema } = mongoose;

const replyComments = new Schema({
    comment: {
        type: String,
        require: true,

    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: 'commentForum',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'ForumUser',
        required: true,
    },

});

module.exports = ReplyComment = mongoose.model("ReplyComment", replyComments);