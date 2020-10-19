# NodeJS WBOT

> A simple Nodejs BOT for whatsapp web and API send message

## 🔍 Preview

### Quick preview

![Screenshot gif](https://user-images.githubusercontent.com/6497827/58411958-1dcc8000-8093-11e9-8aeb-5747efe10266.gif)

## see the examples folder

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
