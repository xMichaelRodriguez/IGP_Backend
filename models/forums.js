const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
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
forumSchema.plugin(mongoosePaginate);
module.exports = Forum = mongoose.model("Forum", forumSchema);
