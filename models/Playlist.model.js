const { Schema, model } = require("mongoose");

const playlistSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, "description is required."],
    },
    image: {
      type: String,
      required: [true, "Image is required."],
    },
    user: {  
      type: Schema.Types.ObjectId,
      ref: "User", 
    },
    name: {
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

const Playlist = model("Playlist", playlistSchema);

module.exports = Playlist;
