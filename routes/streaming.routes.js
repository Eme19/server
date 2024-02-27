const router = require("express").Router();
const Streaming = require('../models/Streaming.model'); 



router.post('/start-streaming', async (req, res) => {
  try {
    const { userId, trackName } = req.body;
    const streamingRecord = new Streaming({
      userId,
      trackName,
    });
    await streamingRecord.save();
    res.status(201).json(streamingRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/stop-streaming/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const streamingRecord = await Streaming.findByIdAndUpdate(
      id,
      { endTime: Date.now() },
      { new: true }
    );
    if (!streamingRecord) {
      return res.status(404).json({ error: 'Streaming record not found' });
    }
    res.json(streamingRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
