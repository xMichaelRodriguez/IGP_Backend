const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentForum = new Schema({
    message: {
        type: String,
        require: true,

    },
    forumId: {
        type: Schema.Types.ObjectId,
        ref: 'Forum',
        required: true,
    },

});

module.exports = Coment = mongoose.model("ComentForum", commentForum);