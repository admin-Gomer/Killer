const { resolveLidToRealJid } = require("../../lib/utils");

module.exports = {
  command: ["повысить", "ascender", "daradmin"],
  description: "Повышение уровня пользователя до администратора группы",
  category: "Группы",
  use: "@0",
  isGroup: true,
  isAdmin: true,
  isBotAdmin: true,
  run: async (client, m, args) => {
    const groupMetadata = await client.groupMetadata(m.chat);
    const participants = await Promise.all(
      groupMetadata.participants.map(async (p) => {
        const realJid = await resolveLidToRealJid(p.id, client, m.chat);
        return { ...p, id: realJid };
      }),
    );
    const groupAdmins = participants
      .filter((p) => p.admin || p.admin === "superadmin")
      .map((p) => p.id);
    const isBotAdmin = groupAdmins.includes(
      client.user.id.split(":")[0] + "@s.whatsapp.net",
    );
    const isSenderAdmin = groupAdmins.includes(m.sender);

    let target;
    if (args[0]) {
      let number = args[0].replace("@", "");
      target = await resolveLidToRealJid(
        number + "@s.whatsapp.net",
        client,
        m.chat,
      );
    } else if (m.quoted) {
      target = await resolveLidToRealJid(m.quoted.sender, client, m.chat);
    } else {
      return m.reply("*Отметьте* *пользователя*, _которого вы хотите_ *продвигать* _в админы._");
    }

    try {
      await client.groupParticipantsUpdate(m.chat, [target], "promote");
      m.reply(`*@${target.split("@")[0]}* _был повышен в должности администратора_`, {
        mentions: [target],
      });
    } catch (e) {
      m.reply("_Администратор не может быть повышен_");
    }
  },
};
