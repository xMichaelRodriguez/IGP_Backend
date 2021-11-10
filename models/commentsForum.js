const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentForum = new Schema({
    comment: {
        type: String,
        require: true,

    },
    forumId: {
        type: Schema.Types.ObjectId,
        ref: 'Forum',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'ForumUser',
        required: true,
    },

});

module.exports = Coment = mongoose.model("ComentForum", commentForum);