window.WAPI.sendMessageToID = function (id, message, done) {
  try {
    window.getContact = (id) => {
      return Store.WapQuery.queryExist(id);
    };
    window.getContact(id).then((contact) => {
      if (contact.status === 404) {
        done(true);
      } else {
        Store.Chat.find(contact.jid)
          .then((chat) => {
            chat.sendMessage(message);
            return true;
          })
          .catch((reject) => {
            if (WAPI.sendMessage(id, message)) {
              done(true);
              return true;
            } else {
              done(false);
              return false;
            }
          });
      }
    });
  } catch (e) {
    if (window.Store.Chat.length === 0) return false;

    firstChat = Store.Chat.models[0];
    var originalID = firstChat.id;
    firstChat.id = typeof originalID === 'string' ? id : new window.Store.UserConstructor(id, { intentionallyUsePrivateConstructor: true });
    if (done !== undefined) {
      firstChat.sendMessage(message).then(function () {
        firstChat.id = originalID;
        done(true);
      });
      return true;
    } else {
      firstChat.sendMessage(message);
      firstChat.id = originalID;
      return true;
    }
  }
  if (done !== undefined) done(false);
  return false;
};

window.WAPI.sendMessageContactByName = (contactName, message, done) => {
  const idChat = WAPI.getMyContacts().find((contact) => {
    if (contact.formattedName.toUpperCase() === contactName.toUpperCase()) {
      return contact;
    }
  });
  if (idChat) window.WAPI.sendMessageToID(idChat.id._serialized, message, done);
};

window.WAPI.sendMessageByNumberContact = (contactNumber, message, done) => {
  const idChat = WAPI.getMyContacts().find((contact) => {
    if (contact.id.user.endsWith(contactNumber)) {
      return contact;
    }
  });
  if (idChat) window.WAPI.sendMessageToID(idChat.id._serialized, message, done);
};

window.WAPI.sendMessageBySimpleNumber = (simpleNumber, message, done) => {
  const idChat = simpleNumber + '@c.us';
  if (idChat) window.WAPI.sendMessageToID(idChat, message, done);
};

window.WAPI.sendFile = function (fileBase64, chatid, filename, caption, done) {
  //var idUser = new window.Store.UserConstructor(chatid);
  var idUser = new window.Store.UserConstructor(chatid, { intentionallyUsePrivateConstructor: true });
  // create new chat
  return Store.Chat.find(idUser).then((chat) => {
    var mediaBlob = '';
    if (filename === 'audio') {
      mediaBlob = window.WAPI.base64AudioToFile(fileBase64);
    } else {
      mediaBlob = window.WAPI.base64ImageToFile(fileBase64, filename);
    }
    var mc = new Store.MediaCollection(chat);
    mc.processAttachments([{ file: mediaBlob }, 1], chat, 1).then(() => {
      var media = mc.models[0];
      media.sendToChat(chat, { caption: caption });
      if (done !== undefined) done(true);
    });
  });
};

window.WAPI.base64ImageToFile = function (b64Data, filename) {
  var arr = b64Data.split(',');
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(b64Data);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

window.WAPI.base64AudioToFile = function (b64Data) {
  var bstr = atob(b64Data);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], 'audio.mp3', { type: 'audio/mpeg' });
};
