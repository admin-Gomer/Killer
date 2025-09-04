module.exports = {
  command: ["удалить", "kick", "удалить", "удалить"],
  description: "Исключение участника из группы",
  category: "Группы",
  isGroup: true,
  isAdmin: true,
  botAdmin: true,
  use: "(@0 или ответить на сообщение)",
  run: async (client, m, args) => {
    if (!m.mentionedJid[0] && !m.quoted) {
      return m.reply(
        "_Отметьте или ответьте на_ *сообщение* _человека, которого вы хотите_ `удалить`",
      );
    }

    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

    const groupInfo = await client.groupMetadata(m.chat);
    const ownerGroup =
      groupInfo.owner || m.chat.split`-`[0] + "@s.whatsapp.net";
    const ownerBot = global.owner[0][0] + "@s.whatsapp.net";

    if (user === client.decodeJid(client.user.id)) {
      return m.reply("_Я не могу удалить_ *бота* _из группы_");
    }

    if (user === ownerGroup) {
      return m.reply("_Я не могу удалить_ *владельца* _из группы_");
    }

    if (user === ownerBot) {
      return m.reply("_Я не могу удалить бота_ *владелец*");
    }

    try {
      await client.groupParticipantsUpdate(m.chat, [user], "remove");
      m.reply(`_Пользователь_ *удален* _успешно_`);
    } catch (e) {
      console.error(e);
      m.reply("_Не удалось удалить пользователя_");
    }
  },
};
