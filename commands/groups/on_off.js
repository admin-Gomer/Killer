module.exports = {
  command: ["включить", "выключить", "on", "off"],
  description: "Включение и отключение функций группы",
  category: "Группы",
  use: "антиссылка",
  isGroup: true,
  isAdmin: true,
  isBotAdmin: true,
  run: async (client, m, args) => {
    const cmd = m.text.trim().split(" ")[0].slice(1).toLowerCase();
    const setting = args[0]?.toLowerCase();
    if (!setting) {
      return m.reply(
        "_*Необходимо указать функцию*_\n\n`Пример`\n_#включить антиссылка_\n_#выключить антиссылка_",
      );
    }
    const chatData = global.db.data.chats[m.chat];

    switch (setting) {
      case "антиссылка":
        chatData.antilink = cmd === "включить";
        m.reply(
          `Функция *антиссылка* была выполнена *${cmd === "включить" ? "Активированный" : "Нетрудоспособный"}*`,
        );
        break;

      default:
        m.reply(
          "_Опция не_ *действительна*\n\n- `Опции:`\n'антиссылка'\n\n\n> `Пример:` #включить антиссылка",
        );
        break;
    }
  },
};
