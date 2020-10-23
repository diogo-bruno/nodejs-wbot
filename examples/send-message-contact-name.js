const axiosInstance = require('./axios');

var obj = {
  fileBase64: '', // required dataType base64 data:xxx;base64,
  typeFile: '', //audio or image or video
  contactName: 'name-is-contact-list', // name contact in list number whatsapp
  numberTo: '', // number location country ex: 55...
  message: 'Teste', // text message...
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
