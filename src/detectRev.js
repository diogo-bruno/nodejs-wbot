var os = require('os');
var platform = os.platform();
var chromePlatform;
//const fetch = require('node-fetch');

switch (platform) {
  case 'win32':
    chromePlatform = 'win';
    break;
  case 'darwin':
    chromePlatform = 'mac';
    break;
  default:
    chromePlatform = 'linux';
    break;
}

this.getRevNumber = function () {
  return new Promise((resolve) => {
    if (chromePlatform === 'linux') {
      resolve('743848');
    } else {
      resolve('722274');
    }
    // fetch('https://omahaproxy.appspot.com/all.json?os=' + chromePlatform, { method: 'get' })
    //   .then(res => res.json())
    //   .then(json => {
    //     try {
    //       var betaChannel = json[0].versions.find(x => x.channel == 'stable').branch_base_position;
    //       resolve(betaChannel);
    //     } catch (error) {
    //       resolve('666595');
    //     }
    //   });
  });
};
