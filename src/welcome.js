//http://patorjk.com/software/taag/#p=display&h=1&v=1&f=ANSI%20Shadow&t=NodeJS%20WBOT
let version = require('../package.json').version;
var logo = `
██╗    ██╗      ██████╗  ██████╗ ████████╗
██║    ██║      ██╔══██╗██╔═══██╗╚══██╔══╝
██║ █╗ ██║█████╗██████╔╝██║   ██║   ██║   
██║███╗██║╚════╝██╔══██╗██║   ██║   ██║   
╚███╔███╔╝      ██████╔╝╚██████╔╝   ██║   
 ╚══╝╚══╝       ╚═════╝  ╚═════╝    ╚═╝   
`;
console.log('>_started_' + new Date().getTime());
console.log(logo);
console.log(`v${version}`);
