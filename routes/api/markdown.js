const express = require('express');
const router = express.Router();
const fs = require('fs');
const global = require('../../common/global.js');
const exec = require('child_process').exec;

/**
 * @route   GET api/markdown/:markdown_id
 * @access  Public
 */
router.get('/:markdown_id', (req, res) => {
  try {
    // res.status(200).json(global.groups[req.params.room_id]);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.put('/:markdown_id', async (req, res) => {
  try {
    const mdFile = `./markdowns/${(req.params.markdown_id).replace('_','/')}.md`;
    const mdRaw = fs.readFileSync(mdFile, 'utf8');

    const mdHeader = mdRaw.split('\n---')[0];

    let mdFinal = mdHeader + '\n---' + req.body.markdown;

    fs.writeFileSync(mdFile, mdFinal);

    let dir = exec("npm run build-client-bo", function(err, stdout, stderr) {
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

router.post('/', async (req, res) => {
  try {

    // Create markdown file
    console.log(req.body);
    const mdFile = `./markdowns/${(req.body.id).replace('_','/')}.md`;
    const mdFinal =
`---
title: '${req.body.title}'
description: '${req.body.description}'
author: '${req.body.author}'
authorLink: 'https://www.google.pt'
publishDate: ${(new Date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
layout: '../../../layouts/BlogPost.astro'
heroImage: '${req.body.image}'
path: '${(req.body.id).replace('_','/')}'
---
Texto do artigo`;

    fs.writeFileSync(mdFile, mdFinal);

    let dir = exec("npm run build-client-bo", function(err, stdout, stderr) {
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