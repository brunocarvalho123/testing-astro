const express = require('express');
const router = express.Router();
const fs = require('fs');
const global = require('../../common/global.js');
const exec = require('child_process').exec;

router.patch('/:markdown_id', async (req, res) => {
  try {
    const mdFile = `./markdowns/${(req.params.markdown_id).replace('__','/')}.md`;
    const mdRaw = fs.readFileSync(mdFile, 'utf8');

    const mdBody = mdRaw.split('\n---')[1];

    properties = global.getMdProperties(mdRaw);

    properties[req.body.prop] = req.body.text.replace(/'/g,"''").replace(/\n/g,'<br />');

    let mdFinal = global.toMdProperties(properties) + '\n' + mdBody;

    fs.writeFileSync(mdFile, mdFinal);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;