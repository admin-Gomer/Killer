const moment = require("moment");

module.exports = {
  command: ["пинг", "ping"],
  description: "Проверьте подключение и отобразите информацию о боте",
  category: "Общее",
  run: async (client, m, args, { prefix }) => {
    const start = Date.now();
    const tempMsg = await client.sendMessage(
      m.key.remoteJid,
      { text: "⏰ Пинг загрузки..." },
      { quoted: m },
    );
    const latency = Date.now() - start;

    const up = process.uptime(),
      h = Math.floor(up / 3600),
      min = Math.floor((up % 3600) / 60),
      s = Math.floor(up % 60);
    const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const userTag = m.pushName || "Гость";
    const sender = m.sender.replace(/@.+/, "");

    const msg = `Привет, ${userTag}

\`Статус пинга\`

\`Гудение:\` ${latency} ms
\`Время безотказной работы:\` [ ${h}h ${min}m ${s}s ]
\`RAM Использованный:\` ${ram} MB
\`Пользователь ID:\` @${sender}`.trim();

    await client.sendMessage(
      m.chat,
      { text: msg, mentions: [m.sender] },
      { quoted: tempMsg },
    );
  },
};
