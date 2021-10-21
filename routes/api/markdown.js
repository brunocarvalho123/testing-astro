const express = require('express');
const router = express.Router();
const fs = require('fs');
const global = require('../../common/global.js');
const exec = require('child_process').exec;

router.patch('/:markdown_id', async (req, res) => {
  try {
    const mdFile = `./markdowns/${(req.params.markdown_id).replace('__','/')}.md`;
    const mdRaw = fs.readFileSync(mdFile, 'utf8');

    const mdHeader = mdRaw.split('\n---')[0];
    let mdBody = mdRaw.split('\n---')[1];

    mdBody = mdBody.replace(new RegExp(`(<div mdid="${req.params.markdown_id}" stripid="${req.body.stripid}" editable>\n\n).*\n.*(<\/div>)`), `$1${req.body.markdown}\n$2`);

    let mdFinal = mdHeader + '\n---' + (mdBody[0] !== '\n' ? '\n' : '' ) + mdBody;

    fs.writeFileSync(mdFile, mdFinal);
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ msg: e.message });
  }
});

router.post('/', async (req, res) => {
  try {

    // Create markdown file
    console.log(req.body);
    const mdFile = `./markdowns/${(req.body.id).replace('__','/')}.md`;
    const mdFinal =
`---
title: '${req.body.title}'
description: '${req.body.description}'
author: '${req.body.author}'
authorLink: 'https://www.google.pt'
publishDate: '${(new Date).toLocaleDateString("pt-PT", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}'
layout: '../../../layouts/BlogPost.astro'
heroImage: '${req.body.image !== undefined ? req.body.image : ""}'
path: '${(req.body.id).split('__')[1]}'
---
<div stripid="1" class="strip no-img">
<div mdid="${req.body.id}" stripid="md-1" editable>

Texto do artigo
</div>
</div>`;

    fs.writeFileSync(mdFile, mdFinal);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;