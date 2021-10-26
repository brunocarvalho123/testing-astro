const express = require('express');
const router = express.Router();
const fs = require('fs');
const global = require('../../common/global.js');
const exec = require('child_process').exec;

router.get('/:markdown_id', async (req, res) => {
  try {
    let markdownId = req.params.markdown_id.split('__');
    if (markdownId.length !== 3) {
      throw Error('Invalid request');
    }

    const mdFile = `./markdowns/${markdownId[0] + '/' + markdownId[1]}.md`;
    const mdRaw = fs.readFileSync(mdFile, 'utf8');

    let mdBody = mdRaw.split('\n---')[1];
    mdBody = mdBody.match(new RegExp(`<div mdid="${markdownId[0] + '__' + markdownId[1]}" stripid="${markdownId[2]}" editable>\n\n((.|\n)*?)<\/div>`));
    if (!mdBody || !mdBody[1]) {
      throw Error('Unable to find requested strip');
    }

    res.status(200).json({ success: true, markdown: mdBody[1] });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ msg: e.message });
  }
});

router.patch('/:markdown_id', async (req, res) => {
  try {
    const mdFile = `./markdowns/${(req.params.markdown_id).replace('__','/')}.md`;
    const mdRaw = fs.readFileSync(mdFile, 'utf8');

    const mdHeader = mdRaw.split('\n---')[0];
    let mdBody = mdRaw.split('\n---')[1];

    console.log(JSON.stringify(req.body.markdown));
    mdBody = mdBody.replace(new RegExp(`(<div mdid="${req.params.markdown_id}" stripid="${req.body.stripid}" editable>\n\n)(.|\n)*?(<\/div>)`), `$1${req.body.markdown}$3`);

    let mdFinal = mdHeader + '\n---' + (mdBody[0] !== '\n' ? '\n' : '' ) + mdBody;

    fs.writeFileSync(mdFile, mdFinal);
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ msg: e.message });
  }
});

router.put('/:markdown_id', async (req, res) => {
  try {
    const mdFile = `./markdowns/${(req.params.markdown_id).replace('__','/')}.md`;
    const mdRaw = fs.readFileSync(mdFile, 'utf8');

    let newStrip;
    let stripid = 0;

    const matches = [...mdRaw.matchAll(/<div stripid="(\d)"/g)];

    matches.forEach(element => {
      if (+element[1] > stripid) {
        stripid = +element[1];
      }
    });

    if (stripid < 1) {
      throw Error('Invalid stripid');
    }

    stripid += 1;

    switch (req.body.type) {
      case 'img-right':
        newStrip = imgRightStrip(req.params.markdown_id, stripid, req.body.markdown, req.body.img);
        break;
      case 'img-left':
        newStrip = imgLeftStrip(req.params.markdown_id, stripid, req.body.markdown, req.body.img);
        break;
      case 'no-img':
        newStrip = noImgStrip(req.params.markdown_id, stripid, req.body.markdown);
        break;
      default:
        throw Error('Invalid type');
        break;
    }

    let mdFinal = mdRaw + newStrip;

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

const imgRightStrip = (mdid, stripid, mdcontent, imgsrc) => {
  return `
<div stripid="${stripid}"t" class="strip img-right">
<div mdid="${mdid}" stripid="md-${stripid}" editable>

${mdcontent}
</div>
<img src="${imgsrc}"></img>
</div>
`;
}
const imgLeftStrip = (mdid, stripid, mdcontent, imgsrc) => {
  return `
<div stripid="${stripid}"" class="strip img-left">
<img src="${imgsrc}"></img>
<div mdid="${mdid}" stripid="md-${stripid}" editable>

${mdcontent}
</div>
</div>
`;
}
const noImgStrip = (mdid, stripid, mdcontent) => {
  return `
<div stripid="${stripid}" class="strip no-img">
<div mdid="${mdid}" stripid="md-${stripid}" editable>

${mdcontent}
</div>
</div>
`;
}

module.exports = router;