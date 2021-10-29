const express = require('express');
const router = express.Router();
const fs = require('fs');
const global = require('../../common/global.js');
const exec = require('child_process').exec;

router.get('/', async (req, res) => {
  try {
    let pages = [];

    exec('find ./client/dist-bo/markdowns -name "index.html"', function(err, stdout, stderr) {
      if (err) {
        console.log(err);
      }
      const dirs = stdout.split('\n');
      dirs.forEach(dir => {
        if (dir.includes('index.html')) {
          pages.push(dir.replace('./client/dist-bo','').replace('index.html',''));
        }
      });
      res.status(200).json({ success: true, pages: pages });
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;