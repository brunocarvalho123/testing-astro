const express = require('express');
const router = express.Router();
const global = require('../../common/global.js');
const exec = require('child_process').exec;

/**
 * @route   GET api/release/
 * @access  Public
 */
router.get('/:action', (req, res) => {
  try {
    let action = '';
    if (req.params.action === 'public') {
      action = 'public';
    } else if (req.params.action === 'backoffice') {
      action = 'bo';
    } else {
      throw Error('Invalid action');
    }

    console.log(`building ${action}`);
    let dir = exec(`npm run build-client-${action}`, function(err, stdout, stderr) {
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