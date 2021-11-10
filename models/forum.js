const mongoose = require("mongoose");
const { Schema } = mongoose;

const forumUserSchema = new Schema({
    name: {
        type: String,
        unique: true,
        require: true,
    },

});

module.exports = ForumUser = mongoose.model("ForumUser", forumUserSchema);
