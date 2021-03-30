import mongoose from "mongoose";
const { Schema } = mongoose;

const storiesSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  body: {
    type: String,
    require: true,
  },
});

storiesSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export const Story = mongoose.model("Story", storiesSchema);
