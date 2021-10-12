const express = require('express');
const router = express.Router();
const global = require('../../common/global.js');
const exec = require('child_process').exec;

/**
 * @route   GET api/release/
 * @access  Public
 */
router.get('/', (req, res) => {
  try {
    console.log('building public');
    let dir = exec("npm run build-client-public", function(err, stdout, stderr) {
      if (err) {
        console.log(err);
      }
      console.log(stdout);
    });

    dir.on('exit', function (code) {
      res.status(200).json({ success: true });
    });

  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;