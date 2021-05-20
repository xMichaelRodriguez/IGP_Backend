const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const noticeSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  body: {
    type: String,
    require: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

noticeSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

noticeSchema.plugin(mongoosePaginate);
module.exports = model("Notice", noticeSchema);
