const moment = require("moment-timezone");
const { pickRandom } = require("../../lib/message");
const { version } = require("../../package.json");

module.exports = {
  command: ["меню", "help", "menu"],
  description: "Отображение команд",
  category: "Общее",
  run: async (client, m, args) => {
    const cmds = [...global.comandos.values()];

    const jam = moment.tz("America/Mexico_City").format("HH:mm:ss");
    const ucapan =
      jam < "05:00:00"
        ? "Добрый день"
        : jam < "11:00:00"
          ? "Добрый день "
          : jam < "15:00:00"
            ? "Добрый день"
            : jam < "19:00:00"
              ? "Добрый день"
              : "Спокойной ночи";

    const fkontak = {
      key: {
        participant: `0@s.whatsapp.net`,
        ...(m.chat ? { remoteJid: `6285600793871-1614953337@g.us` } : {}),
      },
      message: {
        contactMessage: {
          displayName: `${m.pushName || author}`,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${m.pushName || author},;;;\nFN:${m.pushName || author},\nitem1.TEL;waid=${m.sender.split("@")[0]}:${m.sender.split("@")[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
          jpegThumbnail: null,
          thumbnail: null,
          sendEphemeral: true,
        },
      },
    };

    const categories = {};
    cmds.forEach((cmd) => {
      if (!cmd.command) return;
      const cat = (cmd.category || "sin categoría").toLowerCase();
      if (!categories[cat]) categories[cat] = [];
      if (!categories[cat].some((c) => c.command[0] === cmd.command[0])) {
        categories[cat].push(cmd);
      }
    });

    let menu = `╭─❮ *Меню команд* ❯─╮
│
│  ${ucapan}, *${m.pushName || "Пользователь"}*
│
│  *Мини Лурус*
│  Создатель  : +79520830782 
│  Версия  : ${version}
│  Двигатель    : Baileys
│
`;

    for (const [cat, commands] of Object.entries(categories)) {
      const catName = cat.charAt(0).toUpperCase() + cat.slice(1);
      menu += `│─── *${catName}*\n`;
      commands.forEach((cmd) => {
        menu += `│  #${cmd.command[0]}\n`;
      });
      menu += `│\n`;
    }

    menu += `╰────────────────╯`;

    await client.sendMessage(
      m.chat,
      {
        image: { url: "https://ibb.co/p6rqCtSV" },
        caption: menu,
      },
      { quoted: fkontak },
    );
  },
};
