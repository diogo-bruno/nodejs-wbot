const axiosInstance = require('./axios');

axiosInstance
  .post('http://localhost:3300/sendMenssage', {
    urlRecaptcha: '',
    waitSelectorSucces: '',
  })
  .then((res) => {
    console.log(res.data);
  })
  .catch((error) => {
    console.error(error);
  });
