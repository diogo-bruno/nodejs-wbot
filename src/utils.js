var path = require('path');
const mime = require('mime');
var fs = require('fs');
var os = require('os');
var platform = os.platform();

this.injection = function (filename) {
  return new Promise((resolve, reject) => {
    var filepath = path.join(__dirname, filename);
    //console.log("reading file from" + (filepath));
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) return reject(err);
      console.log('1 ' + data);
      resolve(data);
    });
  });
};

this.externalInjection = function (filename) {
  return new Promise((resolve, reject) => {
    //console.log("reading file from" + process.cwd());
    var filepath = path.join(process.cwd(), filename);
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

this.getFileInBase64 = function (filename) {
  return new Promise((resolve, reject) => {
    try {
      filename = path.join(process.cwd(), filename);
      // get the mimetype
      const fileMime = mime.getType(filename);
      var file = fs.readFileSync(filename, { encoding: 'base64' });
      resolve(`data:${fileMime};base64,${file}`);
    } catch (error) {
      reject(error);
    }
  });
};

this.delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

this.getOS = () => {
  var chromePlatform;
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
  return chromePlatform;
};

this.rdn = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

this.getUserAgent = function () {
  const index = this.rdn(1, 4);
  const agents = [
    'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3440.106 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
  ];
  return agents[index];
};

this.saveFileFromBase64 = (base64Data, name, type) => {
  console.log('save file called');
  let extension = mime.getExtension(type);
  try {
    fs.writeFileSync(path.join(process.cwd(), name + '.' + extension), base64Data, 'base64');
  } catch (error) {
    console.error('Unable to write downloaded file to disk');
  }
};

this.mkdirRecurse = (inputPath) => {
  if (fs.existsSync(inputPath)) {
    return;
  }
  const basePath = path.dirname(inputPath);
  if (fs.existsSync(basePath)) {
    fs.mkdirSync(inputPath);
  }
  this.mkdirRecurse(basePath);
};
