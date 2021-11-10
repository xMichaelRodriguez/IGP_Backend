const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const testDatesSchema = new Schema({
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
    default: new Date().toISOString(),
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

testDatesSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

testDatesSchema.plugin(mongoosePaginate);
module.exports = model('testDates', testDatesSchema);