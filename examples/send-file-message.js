const axiosInstance = require('./axios');

const medias = require('./base64Medias');

const obj = {
  fileBase64: medias.getImage(), // required dataType base64 data:xxx;base64,
  typeFile: 'image', //audio or image or video
  contactName: '', // name contact in list number whatsapp
  numberTo: '55...', // number location country ex: 55...
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
