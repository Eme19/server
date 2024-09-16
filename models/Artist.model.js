const { Schema, model } = require("mongoose");

const artistSchema = new Schema(
  {
    name: {
        type: String,
      },

    genre: {
      type: [String],
      enum: ["Rock", "Hip hop", "Pop Music", "Country music" ,"Punk rock","Christian/Gospel"," Indie rock", "Techno", "New wave", "Instrumental", "Reggae", "Rhythm", "Blue" ]
    },
    image: {
      type: [String],
      required: [true, "Image is required."],
    },
    album: {
      type: [Schema.Types.ObjectId],
        ref: "Album",
      },
  

    popularity: {
      type: Number,
    },
   
  },
  {
    
    timestamps: true,
  }
);

const Artist = model("Artist", artistSchema);

module.exports = Artist;
