var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const portService = 3300;

var obj = {
  fileBase64: '', // ignore data:xxx;base64,
  typeFile: '', //audio or image or video
  contactName: '', // name contact in list number whatsapp
  numberTo: '', // number location country ex: +55...
  message: '', // text mensagem...
};

async function enableServiceHttpWBOT(page) {
  app.post('/sendMenssage', async (req, res) => {
    const body = req.body;

    console.log(body);

    /*
       WAPI.sendMessageBySimpleNumber('556282700271','Hello')
       WAPI.sendMessageContactByName('name-contact','Heloo')
       WAPI.sendFile('file-base-64','556292883546@c.us','tipo-file');
    */

    //page.evaluate(() => {});

    res.send('Ok, script evaluate');
  });

  app.listen(portService, function () {
    console.log('App service running in port ' + portService + '!');
  });
}

module.exports.enableServiceHttpWBOT = enableServiceHttpWBOT;
