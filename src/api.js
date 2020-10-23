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

var exampleBody = {
  fileBase64: 'required data:xxx;base64,...',
  typeFile: 'audio or image or video',
  contactName: 'name contact in list number whatsapp',
  numberTo: 'number location country (brazil) ex: 55...',
  message: 'text mensagem...',
};

async function enableServiceHttpWBOT(page) {
  app.post('/sendMessage', async (req, res) => {
    const body = req.body;
    let errorValidation = [];

    if (body.fileBase64 || body.typeFile) {
      if (!body.fileBase64 || !body.typeFile) {
        errorValidation.push('If fileBase64 or typeFile informed, fileBase64 and typeFile is required!');
      }
    } else if (!body.message) {
      errorValidation.push('If not fileBase64 informed, message is required!');
    }

    if (!body.numberTo && !body.contactName) {
      errorValidation.push('NumberTo or contactName is required!');
    }

    if (errorValidation.length) {
      let msg = '';
      errorValidation.push('Examaple body: ' + JSON.stringify(exampleBody) + '<br/>');
      errorValidation.forEach((error) => {
        msg += `${error}<br/>`;
      });
      res.status(400).send(msg);
      return;
    }

    if (body.fileBase64) {
      let base64 = body.fileBase64.split('base64,');
      if (!base64[1]) {
        res.status(400).send('Base64 incorrect, required data:xxx;base64,...');
        return;
      }
    }

    if (body.numberTo && body.numberTo.startsWith('+')) {
      body.numberTo = body.numberTo.substring(1);
    }

    const numberOrName = body.numberTo ? body.numberTo : body.contactName;
    const isContactName = body.contactName ? true : false;

    let chatId = await page.evaluate(
      (numberOrName, isContactName) => {
        return WAPI.getIdUser(numberOrName, isContactName);
      },
      numberOrName,
      isContactName
    );

    if (!chatId) {
      res.status(400).send('Number or ContactName not found');
      return;
    }

    if (body.fileBase64) {
      page.evaluate(
        (chatId, fileBase64, typeFile, message) => {
          WAPI.sendFile(fileBase64, chatId, typeFile, message);
        },
        chatId,
        body.fileBase64,
        body.typeFile,
        body.message
      );
    } else if (body.message) {
      page.evaluate(
        (chatId, message) => {
          WAPI.sendMessageToID(chatId, message);
        },
        chatId,
        body.message
      );
    }

    res.send('Send script evaluate');
  });

  app.listen(portService, function () {
    console.log('App service running in port ' + portService + '!');
  });
}

module.exports.enableServiceHttpWBOT = enableServiceHttpWBOT;
