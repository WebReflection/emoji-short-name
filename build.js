const fs = require('fs');
const ee = require('emoji-essential');

const {keys} = Object;

const emojiShortName = {};

keys(ee).forEach(group => {
  keys(ee[group]).forEach(sub => {
    keys(ee[group][sub]).forEach(emoji => {
      emojiShortName[emoji] = ee[group][sub][emoji];
    });
  });
});

fs.writeFile(
  'index.js',
  `var emojiShortName = ${JSON.stringify(emojiShortName, null, '  ')};\n`,
  err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  }
);
