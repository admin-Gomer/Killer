const fs = require("fs");
const chalk = require("chalk");

global.owner = ["+79520830782"]; //Cambia este número por el tuyo
global.sessionName = "lurus_session";
global.version = "v1.0.0 | Mini";
global.namebot = "Ai Lurus - Mini";
global.author = "꧁☠︎︎🅼🅸🅺🅷🅰︎🅸🅻☠︎︎꧂";

//Modifica los mensajes a tu preferencia
global.mess = {
  admin: "→ Эта роль зарезервирована для администраторов групп",
  botAdmin: "→ Чтобы запустить эту функцию, я должен быть администратором",
  owner: "→ Только мой создатель может использовать эту команду",
  group: "→ Эта функция работает только в группах",
  private: "→ Эта функция работает только с личными сообщениями",
  wait: "→ Подожди минутку...",
};

global.thumbnailUrl = "https://ibb.co/p6rqCtSV"; //Cambia esta imagen

global.my = {
  ch: "120363401477412280@newsletter", //Cambia este id por el de tu canal
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.yellowBright(`Обновлять '${__filename}'`));
  delete require.cache[file];
  require(file);
});
