const router = require("express").Router();
const Appactivity = require("../models/Appactivity.model");

router.post("/app-activity", async (req, res) => {
  try {
    const { activity, time } = req.body;
    const newActivity = new Appactivity({ activity, time });
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    console.error('Error creating "App Activity" record:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/app-activity", async (req, res, next) => {
  try {
    const appActivity = await Appactivity.find();
    res.json(appActivity);
  } catch (error) {
    console.error('Error fetching "App Activity" records:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/app-activity/:id", async (req, res) => {
  try {
    const activity = await Appactivity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: "App Activity not found" });
    }
    res.json(activity);
  } catch (error) {
    console.error('Error fetching "App Activity" record:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/app-activity/:id", async (req, res) => {
  try {
    const { activity, time } = req.body;
    const updatedActivity = await Appactivity.findByIdAndUpdate(
      req.params.id,
      { activity, time },
      { new: true }
    );
    if (!updatedActivity) {
      return res.status(404).json({ message: "App Activity not found" });
    }
    res.json(updatedActivity);
  } catch (error) {
    console.error('Error updating "App Activity" record:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/app-activity/:id", async (req, res) => {
  try {
    const deletedActivity = await Appactivity.findByIdAndRemove(req.params.id);
    if (!deletedActivity) {
      return res.status(404).json({ message: "App Activity not found" });
    }
    res.json({ message: "App Activity deleted successfully" });
  } catch (error) {
    console.error('Error deleting "App Activity" record:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
