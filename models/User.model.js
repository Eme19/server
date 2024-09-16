const { Schema, model } = require("mongoose");


const userSchema = new Schema(
  {
 
    username: {
      type: String,
      required: true,
    }, 
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
   
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },

    role: { type: String,
       enum: ["user", "admin"], 
       default: "user" },


    library: [
      {
        type: Schema.Types.ObjectId,
        ref: "Album", 
      },
    ],
    
  },
  {
   
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
