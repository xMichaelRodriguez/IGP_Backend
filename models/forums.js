const mongoose = require("mongoose");
const { Schema } = mongoose;

const forumSchema = new Schema({
    name: {
        type: String,
        unique: true,
        require: true,
    },

});

module.exports = Forum = mongoose.model("Forum", forumSchema);
