const puppeteer = require('puppeteer-core');
const _cliProgress = require('cli-progress');
const spintax = require('mel-spintax');

require('./welcome');

var fs = require('fs');
var spinner = require('./step');
var utils = require('./utils');
var qrcode = require('qrcode-terminal');
var path = require('path');
var argv = require('yargs').argv;
var rev = require('./detectRev');
var constants = require('./constants');
var configs = require('../bot');
var settings = require('./settings');
var screenshotPage = require('./screenShots');

let browser;
let page;

async function Main() {
  try {
    await downloadAndStartThings();

    var isLogin = await checkLogin();

    if (!isLogin) {
      await getAndShowQR();
    }

    if (configs.smartreply.suggestions.length > 0) {
      await setupSmartReply();
    }

    console.log('WBOT is ready!! Let those message come.');

    process.stdin.resume();

    process.on('SIGINT', function () {
      if (browser) browser.close();
    });

    activeFunctionUseHere();

    return page;
  } catch (e) {
    console.error('\nError in Main -> ' + e);
    await screenshotPage(page, 'error');
    throw e;
  }

  async function downloadAndStartThings() {
    let botjson = utils.externalInjection('bot.json');

    var appconfig = await utils.externalInjection('bot.json');

    appconfig = JSON.parse(appconfig);

    spinner.start('Downloading chrome\n');

    const browserFetcher = puppeteer.createBrowserFetcher({
      path: process.cwd(),
    });

    const progressBar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_grey);

    progressBar.start(100, 0);

    var revNumber = await rev.getRevNumber();

    const revisionInfo = await browserFetcher.download(revNumber, (download, total) => {
      var percentage = (download * 100) / total;
      progressBar.update(percentage);
    });

    progressBar.update(100);

    spinner.stop('Downloading chrome... done!');

    spinner.start('Launching Chrome');

    var pptrArgv = [];

    if (argv.proxyURI) {
      pptrArgv.push('--proxy-server=' + argv.proxyURI);
    }

    const extraArguments = Object.assign({});
    extraArguments.userDataDir = constants.DEFAULT_DATA_DIR;

    browser = await puppeteer.launch({
      executablePath: revisionInfo.executablePath,
      headless: utils.getOS() === 'linux' ? true : appconfig.appconfig.headless,
      defaultViewport: null,
      ignoreHTTPSErrors: true,
      devtools: false,
      args: [...constants.DEFAULT_CHROMIUM_ARGS, ...pptrArgv, `--window-size=${1280},${900}`],
      ...extraArguments,
    });

    if (argv.proxyURI) {
      spinner.info('Using a Proxy Server');
    }

    page = await browser.pages();

    page = page[0];

    await page.setViewport({ width: 1280, height: 760 });

    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3803.0 Safari/537.36');

    await page.setRequestInterception(true);

    await page.setCacheEnabled(false);

    await page.setBypassCSP(true);

    if (argv.proxyURI) {
      await page.authenticate({ username: argv.username, password: argv.password });
    }

    page.on('request', (request) => {
      if (request._url === 'https://web.whatsapp.com') {
        const headers = Object.assign({}, request.headers(), {
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'none',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': 1,
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3641.0 Safari/537.36',
        });
        request.continue({ headers });
      } else {
        request.continue(request.headers());
      }
    });

    spinner.stop('Launching Chrome... done!');

    spinner.start('Opening Whatsapp');

    await page.goto('https://web.whatsapp.com/', {
      waitUntil: 'networkidle0',
      timeout: 0,
    });

    botjson
      .then((data) => {
        page.evaluate('var intents = ' + data);
      })
      .catch((err) => {
        console.log('there was an error \n' + err);
      });

    page.exposeFunction('log', (message) => {
      console.log(message);
    });

    // When the settings file is edited multiple calls are sent to function. This will help
    // to prevent from getting corrupted settings data
    let timeout = 5000;

    // Register a filesystem watcher
    fs.watch(constants.BOT_SETTINGS_FILE, (event, filename) => {
      setTimeout(() => {
        settings.LoadBotSettings(event, filename, page);
      }, timeout);
    });

    page.exposeFunction('getFile', utils.getFileInBase64);

    page.exposeFunction('saveFile', utils.saveFileFromBase64);

    page.exposeFunction('resolveSpintax', spintax.unspin);

    await screenshotPage(page, 'launch');

    browser.on('targetdestroyed', async () => {
      const openPages = await browser.pages();
      if (openPages.length == 0) {
        await browser.close();
        process.exit(0);
      }
    });

    spinner.stop('Opening Whatsapp ... done!');
  }

  async function injectScripts() {
    spinner.stop();

    spinner.start('Trying to inject the scripts');

    await utils.delay(5000);

    await screenshotPage(page, 'injectScripts');

    spinner.stop();

    return await page
      .waitForSelector('[data-icon="search"]')
      .then(async () => {
        var filepath = path.join(__dirname, 'WAPI.js');
        await page.addScriptTag({ path: require.resolve(filepath) });

        filepath = path.join(__dirname, 'WAPI.extend.js');
        await page.addScriptTag({ path: require.resolve(filepath) });

        filepath = path.join(__dirname, 'inject.js');
        await page.addScriptTag({ path: require.resolve(filepath) });

        return true;
      })
      .catch((e) => {
        spinner.info('User is not logged in. Wait 30 seconds. ->' + JSON.stringify(e));
        return false;
      });
  }

  async function checkLogin() {
    let timeIndex = 0;
    const timeDelayInSeconds = 10;

    while (timeIndex < timeDelayInSeconds) {
      spinner.update(`Page is loading, wait for ${timeDelayInSeconds - timeIndex} seconds`);
      timeIndex++;
      await utils.delay(1000);
    }

    var output = await page.evaluate("localStorage['last-wid']");

    await screenshotPage(page, 'checklogin');

    if (output) {
      spinner.stop('Looks like you are already logged in');
      await injectScripts();
    } else {
      spinner.info('You are not logged in. Please scan the QR below');
    }

    return output;
  }

  async function getAndShowQR() {
    await utils.delay(1000);

    var scanme = "img[alt='Scan me!'], canvas";

    await page.waitForSelector(scanme);

    var imageData = await page.evaluate(`document.querySelector("${scanme}").parentElement.getAttribute("data-ref")`);

    await page.evaluate(`document.querySelector('[name="rememberMe"]').checked = true;`);

    qrcode.generate(imageData, { small: true });

    spinner.start('Waiting for scan \nKeep in mind that it will expire after few seconds');

    var isLoggedIn = await injectScripts();

    await screenshotPage(page, 'getqrcode');

    while (!isLoggedIn) {
      isLoggedIn = await injectScripts();
    }

    if (isLoggedIn) {
      spinner.stop('Looks like you are logged in now');
    }
  }

  async function setupSmartReply() {
    await utils.delay(1000);

    spinner.start('Setting up smart reply');

    await page.waitForSelector('body');

    await page.evaluate(`
            var observer = new MutationObserver((mutations) => {
                for (var mutation of mutations) {
                    //console.log(mutation);
                    if (mutation.addedNodes.length && mutation.addedNodes[0].id === 'main') {
                        //newChat(mutation.addedNodes[0].querySelector('.copyable-text span').innerText);
                        console.log("%cChat changed !!", "font-size:x-large");
                        WAPI.addOptions();
                    }
                }
            });
            observer.observe(document.querySelector('#app'), { attributes: false, childList: true, subtree: true });
        `);

    spinner.stop('Setting up smart reply... done!');

    page.waitForSelector('#main', { timeout: 0 }).then(async () => {
      await page.exposeFunction('sendMessage', async (message) => {
        return new Promise(async (resolve, reject) => {
          //send message to the currently open chat using power of puppeteer
          await page.type('#main div.selectable-text[data-tab]', message);
          if (configs.smartreply.clicktosend) {
            await page.click('#main > footer > div.copyable-area > div:nth-child(3) > button');
          }
        });
      });
    });
  }

  function activeFunctionUseHere() {
    setInterval(async () => {
      if (page && !page._closed)
        await page.evaluate(() => {
          if (document.querySelector('[data-animate-modal-body="true"] div[role="button"]:last-child')) {
            document.querySelector('[data-animate-modal-body="true"] div[role="button"]:last-child').click();
          }
        });
    }, 3000);
  }
}

module.exports.Main = Main;
