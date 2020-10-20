var fs = require('fs');
var path = require('path');
var dir = './screenshots';

const debug = false;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const screenshotPage = async function (page, name) {
  if (debug || name === 'error') {
    await page.screenshot({
      path: path.join(process.cwd(), 'screenshots/' + new Date().getTime() + '-' + Math.floor(Math.random() * 10) + (name ? name : '') + '.png'),
    });
  } else {
    return new Promise(async (resolve, reject) => {
      resolve();
    });
  }
};

module.exports = screenshotPage;
