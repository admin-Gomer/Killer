const fs = require("fs");
const path = require("path");

function reloadCommands(dir = path.join(__dirname, "..")) {
  const commandsMap = new Map();

  function readCommands(folder) {
    const files = fs.readdirSync(folder);
    files.forEach((file) => {
      const fullPath = path.join(folder, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
        readCommands(fullPath);
      } else if (file.endsWith(".js")) {
        delete require.cache[require.resolve(fullPath)];
        const cmd = require(fullPath);
        if (cmd.command) {
          cmd.command.forEach((c) => {
            commandsMap.set(c, cmd);
          });
        }
      }
    });
  }

  readCommands(dir);
  global.comandos = commandsMap;
}

module.exports = {
  command: ["update", "actualizar"],
  description: "Обновление с GitHub",
  isOwner: true,
  category: "Владелец",
  run: async (client, m, args, from, isCreator) => {
    const { exec } = require("child_process");
    const baseDir = path.join(__dirname, "..");

    exec("git pull", (error, stdout, stderr) => {
      reloadCommands(baseDir);
      let msg = "";
      if (stdout.includes("Уже в актуальном состоянии.")) {
        msg = "*Статус:* Все в курсе последних событий";
      } else {
        msg = `*Обновление завершено*\n\n${stdout}`;
      }
      client.sendMessage(m.key.remoteJid, { text: msg }, { quoted: m });
    });
  },
};
