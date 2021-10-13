const express = require('express');
const router = express.Router();
const fs = require('fs');
const formidable = require('formidable');


/**
 * @route   GET api/upload/
 * @access  Public
 */
router.post('/', (req, res) => {
  try {
    const form = formidable({ multiples: false });

    form.parse(req, (err, fields, files) => {
      const oldpath = files.image.path;
      const newpath = './uploads/' + files.image.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.status(200).json({ success: true, path: `/uploads/${files.image.name}` });
      });
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;