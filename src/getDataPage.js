//document.querySelector("#side img")
//document.querySelector('.copyable-area img').src
//document.querySelector('.copyable-area .copyable-text').textContent
const path = require('path');
const fs = require('fs');
const os = require('os');
var sha1 = require('sha1');
const terminalImage = require('terminal-image');

this.userInfo = async (page) => {
  await page.evaluate(() => {
    if (document.querySelector('#side img')) {
      document.querySelector('#side img').click();
    }
  });
  var imageUser = await page.evaluate(`document.querySelector('.copyable-area img').src`);

  var imgB64 = await page.evaluate((imgUser) => {
    return new Promise((resolve, reject) => {
      imageSrcToDataURL(imgUser, function (dataUrl) {
        resolve(dataUrl);
      });
    });
  }, imageUser);

  var imageUserFS = os.tmpdir() + path.sep + sha1(imageUser) + '.jpg';
  fs.writeFileSync(imageUserFS, new Buffer.from(imgB64.replace('data:image/png;base64,', ''), 'base64'));

  var nameUser = await page.evaluate(`document.querySelector('.copyable-area .copyable-text').textContent`);
  await page.evaluate(() => {
    if (document.querySelector('.copyable-area button > [data-testid="back"]')) {
      document.querySelector('.copyable-area button > [data-testid="back"]').click();
    }
  });
  //return { imageUser, nameUser, imageUserFS };
  const userInfo = { imageUser, nameUser, imageUserFS };

  console.log(' ');
  console.log('-------------------------');
  console.log(' ');
  console.log(await terminalImage.file(userInfo.imageUserFS, { width: 40, preserveAspectRatio: true }));
  console.log('User Logged: ' + userInfo.nameUser);
  console.log(' ');
  console.log('-------------------------');
  console.log(' ');
};
