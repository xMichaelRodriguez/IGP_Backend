const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const CommicSchema = new Schema({
  title: {
    type: String,
    require: true,
  },

  date: {
    type: String,
    require: true,
    default: new Date(),
  },
  coverPage: {
    type: Object,
    require: true,
  },
  gallery: {
    type: Array,
    require: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

CommicSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

CommicSchema.plugin(mongoosePaginate);
module.exports = model('Commic', CommicSchema);
