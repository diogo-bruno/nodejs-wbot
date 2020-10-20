var path = require('path');

this.DEFAULT_CHROMIUM_ARGS = [
  '--disable-gpu',
  '--renderer',
  '--no-sandbox',
  '--no-service-autorun',
  '--no-experiments',
  '--no-default-browser-check',
  '--disable-webgl',
  '--disable-threaded-animation',
  '--disable-threaded-scrolling',
  '--disable-in-process-stack-traces',
  '--disable-histogram-customizer',
  '--disable-gl-extensions',
  '--disable-extensions',
  '--disable-composited-antialiasing',
  '--disable-canvas-aa',
  '--disable-3d-apis',
  '--disable-accelerated-2d-canvas',
  '--disable-accelerated-jpeg-decoding',
  '--disable-accelerated-mjpeg-decode',
  '--disable-app-list-dismiss-on-blur',
  '--disable-accelerated-video-decode',
  '--num-raster-threads=1',
  '--disable-infobars',
  '--window-position=0,0',
  '--ignore-certificate-errors',
  '--ignore-certificate-errors-spki-list',
  '--unhandled-rejections=strict',
  '--user-data-dir=' + this.DEFAULT_DATA_DIR,
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3803.0 Safari/537.36',
  '--lang=en-US,en;q=0.9',
];

this.DEFAULT_DATA_DIR = path.join(process.cwd(), 'chromium-data');

/**
 * Name of the file that stores bot configuration
 */
this.BOT_SETTINGS_FILE = 'bot.json';
