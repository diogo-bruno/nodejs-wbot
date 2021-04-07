require('./consoleOutput').setIntercetp();

const terminalImage = require('terminal-image');

var startWhatsAppWeb = require('./startWhatsAppWeb');
var api = require('./api');

let page;

var spinner = require('./step');

async function start() {
  //document.querySelector('.copyable-area img').src
  //document.querySelector('.copyable-area .copyable-text').textContent
  console.log(await terminalImage.file('diogo.jpg', { width: 50, preserveAspectRatio: true }));

  api.startServices();
  spinner.start('Teste spinner');

  setTimeout(function () {
    spinner.stop('Teste spinner stop');

    // setInterval(() => {
    //   console.log(new Date());
    // }, 2000);
  }, 5000);
  //page = await startWhatsAppWeb.Main();
  //api.enableServiceHttpWBOT(page);
}

start();
