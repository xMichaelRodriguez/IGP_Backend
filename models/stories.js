const { Schema, model } = require('mongoose');
const mongoosePagination = require('mongoose-paginate-v2');
const storiesSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  body: {
    type: String,
    require: true,
  },

  date: {
    type: String,
    require: true,
    default: new Date(),
  },
  imageUrl: {
    type: String,
    require: true,
  },
  publicImg_id: {
    type: String,
    require: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

storiesSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// load Pagination
storiesSchema.plugin(mongoosePagination);

module.exports = model('Story', storiesSchema);
