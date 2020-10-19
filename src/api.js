var midia = require('./base64Medias');
var express = require('express');
var app = express();

const portService = 3300;

async function enableServiceHttpWBOT(page) {
  app.post('/sendMenssage', function (req, res) {
    //page.evaluate(`for(var i = 0; i < 3; i++){ WAPI.sendMessageBySimpleNumber('5562981464510','Olá / '+i) }`);
    res.send('Hello World!');
  });

  app.listen(portService, function () {
    console.log('App service running in port ' + portService + '!');
  });
}

module.exports.enableServiceHttpWBOT = enableServiceHttpWBOT;
