require('./consoleOutput').setIntercetp();

var startWhatsAppWeb = require('./startWhatsAppWeb');
var api = require('./api');
var dataPage = require('./getDataPage');
let page;

async function start() {
  api.startServices();
  page = await startWhatsAppWeb.Main();
  await api.enableServiceHttpWBOT(page);
  await dataPage.userInfo(page);
}

start();
