const { Schema, model } = require("mongoose");

const albumSchema = new Schema(
  {
    total_tracks: {
      type: Number,
      required: [true, "total track is required."],
    },
    image: {
      type: String,
      required: [true, "Image is required."],
    },
    title: {
      type: String,
      required: [true, "title is required."],
    },
    release_date: {
      type: String,
    },
   
    genre: {
      type: [String],
      enum: ["Rock", "Hip hop", "Pop Music", "Country music" ,"Punk rock","Christian/Gospel"," Indie rock", "Techno", "New wave", "Instrumental", "Reggae", "Rhythm", "Blue" ]
    },
    popularity: {
      type: Number,
    },
    artist: [
      {
        type: Schema.Types.ObjectId, 
        ref: "Artist",
      },
    ],

    album_type: {
      type: String,
    },

    track: [
      {
        type: Schema.Types.ObjectId, 
        ref: "Track",
      },
    ],
  },
  {
   
    timestamps: true,
  }
);

const Album = model("Album", albumSchema);

module.exports = Album;
