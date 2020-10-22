var startWhatsAppWeb = require('./startWhatsAppWeb');
var api = require('./api');
let page;
async function start() {
  page = await startWhatsAppWeb.Main();
  api.enableServiceHttpWBOT(page);
}

start();
