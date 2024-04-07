const { Schema, model } = require("mongoose");

const trackSchema = new Schema(
  {


    name: {
      type: [String],
    },
   
    duration: {
      type: Number,
    },

    artist: {
      type: String,
    },

    track_number: {
      type: Number,
    },
    filename: {
      type: String,
    },


  
  },

  
  {
    timestamps: true,
  }
);

const Track = model("Track", trackSchema);

module.exports = Track;
