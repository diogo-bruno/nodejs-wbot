var startWhatsAppWeb = require('./startWhatsAppWeb');
var api = require('./api');

async function start() {
  const page = await startWhatsAppWeb.Main();

  api.enableServiceHttpWBOT(page);
}

start();
