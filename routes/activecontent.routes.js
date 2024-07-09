const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();

router.use(express.json());
router.use(cookieParser());

router.get('/getActiveContent', (req, res) => {
  const activeContent = req.cookies.activeContent || null; 
  res.json({ activeContent });
});

router.post('/setActiveContent', (req, res) => {
  const { activeContent } = req.body;
  res.cookie('activeContent', activeContent, { httpOnly: true });
  res.end();
});


router.get('/selectAlbum', (req, res) => {
    const selectedAlbumId = req.cookies.selectedAlbumId || null; 
    res.json({ selectedAlbumId });
});
  

router.post('/setSelectedAlbumId', (req, res) => {
    const { selectedAlbumId } = req.body;
    res.cookie('selectedAlbumId', selectedAlbumId, { httpOnly: true });
    res.end();
});


module.exports = router;

