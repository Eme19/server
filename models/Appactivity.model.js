const { Schema, model } = require("mongoose");

const appActivitySchema = new Schema(
  {
    activity: String,
    time: String,
  },
  {
    timestamps: true,
  }
);

const Appactivity = model("Appactivity", appActivitySchema);

module.exports = Appactivity;