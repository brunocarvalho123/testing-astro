const express = require('express');
const router = express.Router();
const fs = require('fs');
const formidable = require('formidable');
const { nanoid } = require('nanoid');

/**
 * @route   GET api/upload/
 * @access  Public
 */
router.post('/', (req, res) => {
  try {
    const form = formidable({ multiples: false });

    form.parse(req, (err, fields, files) => {
      console.log(JSON.stringify(fields));
      const oldpath = files.file.path;
      let uuid = nanoid(8);
      switch (files.file.type) {
        case 'image/png':
          uuid += '.png';
          break;
        case 'image/jpeg':
          uuid += '.jpg';
          break;
        case 'image/gif':
          uuid += '.gif';
          break;
        default:
          throw Error('Inavalid or unsupported type');
          break;
      }

      const newpath = './uploads/tmp/' + uuid;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.status(200).json({ success: true, path: `/uploads/tmp/${uuid}` });
      });
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;