const mongoose = require('mongoose');

const streamingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  trackName: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  endTime: {
    type: Date,
  },
});

const Streaming = mongoose.model('Streaming', streamingSchema);

module.exports = Streaming;
