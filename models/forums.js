const mongoose = require("mongoose");
const { Schema } = mongoose;

const forumSchema = new Schema({
    theme: {
        type: String,
        unique: true,
        require: true,
    },
    content: {
        type: String, require: true,
    },
    created: {
        type: Date,
        default: new Date()
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'ForumUser',
        required: true,
    },

});

module.exports = Forum = mongoose.model("Forum", forumSchema);
