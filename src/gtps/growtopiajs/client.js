const {Client} = require("whatsapp-web.js")
const { exec } = require("child_process");
const kill = require("child_process").exec
const code = require("qrcode-terminal")
const {username, folder} = require("../fikabot/setting.json")
const fs = require("fs")
const req = require("request")
const isRunning = (query, cb) => {
    let platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32' : cmd = `tasklist`; break;
        case 'darwin' : cmd = `ps -ax | grep ${query}`; break;
        case 'linux' : cmd = `ps -A`; break;
        default: break;
    }
    exec(cmd, (err, stdout, stderr) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
}
const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({ puppeteer: { headless: true }, session: sessionCfg });
client.on('qr', (qr) => {
code.generate(qr, {small: true});
})
client.on('authenticated', (session) => {
  //console.log('AUTHENTICATED', session);
  sessionCfg=session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
      if (err) {

          console.error(err);
      }
  });
});
client.on('ready', () => {
    console.log("Bot Dijalankan")
})
client.on('message', msg => {
const user = msg.getContact
    if(msg.body == "/player") {
        fs.readFile(`C:/Users/${username}/${folder}/onlineplayer.txt`, (err,data) => {
            msg.reply("*[INFO]* : \n\n\n*_Player Online_*\n"+ data +"")
        })
    }
        if(msg.body == "/count") {
            fs.readdir(`C:/Users/${username}/${folder}/worlds`, (err,world) => {

            
            fs.readdir(`C:/Users/${username}/${folder}/players`, (err,player) => {

            
            let robert = world.length;
            let ifika = player.length;
            msg.reply("*[INFO]* :\n\n\n```World Count : "+ robert +"\nPlayer Count: "+ ifika +"```")
        })});;
    }
    if(msg.body == "/howgay") {
        let random = Math.floor((Math.random() * 100) + 1);
        msg.reply(`*You Gay : ${random}%*`)
    }
        
        if(msg.body == "/help") {
            msg.reply("*[FIKABOT]*\nThis a Purpose Project.\n\n\n/player : Player Online GTPS\n/status : Status Server.\n/count : Berapa Player?")
        }
        if(msg.body == "/status") {
            isRunning('enet.exe', (status) => {
if(status == true) {
     msg.reply("*Status Currently : UP*")
}
else {
     msg.reply("*Server Currently : DOWN*")
}
});
            
}  
        
    
});
client.initialize()
