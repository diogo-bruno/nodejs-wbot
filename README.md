# NodeJS WBOT

> A NodeJS BOT for whatsapp web and API send message

## 🔍 Preview

### Quick preview

![image](https://user-images.githubusercontent.com/11491923/96534187-9e31e900-1265-11eb-8211-ae0b4174aebe.png)

## Look in examples folder

```javascript
const axiosInstance = require('./axios');

const medias = require('./base64Medias');

const obj = {
  fileBase64: medias.getAudio(), // required dataType base64 data:xxx;base64,...
  typeFile: 'audio', //audio or image or video
  contactName: '', // name contact in list whatsapp
  numberTo: '55999...', // number location country ex: 55...
  message: 'Test', // text message...
};

axiosInstance
  .post('http://localhost:3300/sendMessage', obj)
  .then((res) => {
    console.log(res.data);
  })
  .catch((error) => {
    if (error.response.status == 400) {
      console.error(error.data);
    } else {
      console.error(error);
    }
  });
```

### bot.json

**appconfig**

This is where all the application related (node application behavior and such things) config will stay. Will add more in future.

- **headless** whether to start chrome as headless or not. this is regarding #4. Apparently, Whatsapp doesn't allow headless instances.
- **isGroupReply** whether to send replies in group or not. If set to false, Bot will not reply if message received in group chat.

**bot**

An array of objects. Properties of Object are self explanatory.

- **Contains** If message has one of that word anywhere in the message
- **exact** If message is exactly as one of the messages form array

- **Response** If any of the above conditions becomes true then corresponding response string will be sent as message to the user or group.

- **file** name of the file (from current directory) which you want to send along with response

**Blocked**

Array of numbers with county code to which this bot will not reply to.

**noMatch**

Default reply message when no exact match found in BOT

**smartreply**

An object which contains suggestions and it's configs.

- **suggestions** An Array of suggestions
- **clicktosend** Whether to send or just write message when user clicks on suggestion

## Run the latest code from github

**This is only recommended for advanced 'node.js' users.**

```
git clone https://github.com/diogo-bruno/nodejs-wbot.git
cd nodejs-wbot
npm install
npm start
```

## 💻 Technologies

- [Node](https://nodejs.org/en/)
- [puppeteer](https://github.com/GoogleChrome/puppeteer)
