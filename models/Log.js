const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema(
  {
    ip: String
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const Log = mongoose.model('Log', logSchema);
module.exports = Log;
