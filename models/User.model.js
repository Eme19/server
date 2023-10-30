












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
       required: false,
     },

     state: {
       type: String,
       default: 'YourDefaultState',
     },
     country: {
       type: String,
       default: 'YourDefaultCountry',
     },
     image: {
       type: String,
     },

     role: { type: String, enum: ["user", "admin"], default: "user" },
    
     consent: {
       type: Boolean,
       default: false,
     },
     googleId: {
       type: String,
       unique: true, 
    },

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




