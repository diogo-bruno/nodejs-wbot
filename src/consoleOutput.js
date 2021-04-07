var Convert = require('ansi-to-html');
var path = require('path');
const fs = require('fs');
var intercept = require('./interceptStdout');
var utils = require('./utils');

const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

const historyMsgs = [];

io.on('connection', (client) => {
  console.log('a user connected');

  client.on('event', (data) => {
    //console.log(data);
  });
  client.on('disconnect', () => {
    /* … */
  });

  io.emit('console', historyMsgs);
});

server.listen(3000);

var output = '';
var outputOriginal = '';

var outputFolder = path.join(process.cwd(), 'output-console/');

utils.mkdirRecurse(outputFolder);

this.getOutput = () => {
  const data = fs.readFileSync(outputFolder + 'output.txt', { encoding: 'utf8', flag: 'r' });
  var dataSplit = data.split('\n');

  var htmlEnd = '';

  dataSplit.forEach((html) => {
    if (html.indexOf('<span style="') > -1) {
      html = html.replace(/([?25])\w+/, '');
      html = html.replace(/([?7])\w+/, '');
      html = html.replace('</span></span>', '');
      html = html.replaceAll('</span>G<span', '</span><span');
      html = html.replaceAll('</span>GAG<span', '</span><span');
      var lastHtml = html.split('</span><span style=');
      if (lastHtml.length > 1) {
        lastHtml = lastHtml[lastHtml.length - 1];
        html = '</span><span style=' + lastHtml;
        html = html.replaceAll('</span></span>', '</span>');
      }
    }
    if (html.startsWith('<span ')) {
      html = html + '</span></span>';
    }
    html = html.replace(/(<([^>]+)>)/gi, '');
    htmlEnd += html + '\n';
  });

  var responseHtmlEnd =
    '<textarea readonly style="width: 100%; height: 100%; background: #000; color: green; touch-action: none; padding: 10px; border: none; resize: none;">' +
    htmlEnd +
    '</textarea>';

  fs.writeFileSync(outputFolder + 'output.html', responseHtmlEnd);

  return responseHtmlEnd;
};

this.setIntercetp = () => {
  var convert = new Convert({
    fg: '#000',
    bg: '#000',
    newline: false,
    escapeXML: false,
    stream: false,
  });

  intercept(function (text) {
    outputOriginal += text;
    fs.writeFileSync(outputFolder + 'output_default.txt', outputOriginal);

    if (text.indexOf('[') > -1) {
      output += convert.toHtml(text);
    } else {
      output += text;
    }

    historyMsgs.push(text);
    io.emit('console', [text]);

    fs.writeFileSync(outputFolder + 'output.txt', output);
  });
};
