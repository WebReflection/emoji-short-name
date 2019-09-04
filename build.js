const fs = require('fs');
const {app, BrowserWindow} = require('electron');

app.on('ready', () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    images: false,
    webgl: false
  });
  win.loadURL('https://unicode.org/emoji/charts/full-emoji-list.html');
  console.log('please wait');
  win.webContents.on('did-finish-load', () => {
    win.webContents.executeJavaScript(
      `(() => {
        const emoji = {};
        for (const code of document.querySelectorAll('td.code')) {
          const text = code.textContent.trim();
          const unicode = text.replace(/U\\+/g, '0x').replace(/[\\s\\n\\r\\f]+/g, ', ');
          const key = eval('String.fromCodePoint(' + unicode + ')');
          emoji[key] = code.parentElement.lastElementChild.textContent.trim();
        }
        return emoji;
      })()`,
      emoji => {
        fs.writeFile(
          'index.js',
          `var emojiShortName = ${JSON.stringify(emoji, null, '  ')};\n`,
          err => {
            if (err) {
              console.error(err);
              process.exit(1);
            }
            win.close();
          }
        );
      }
    );
  });
});
