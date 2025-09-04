const { generateWAMessageFromContent } = require("@whiskeysockets/baileys");

module.exports = {
  command: ["вызов", "tag", "hidetag"],
  description: "Упомяните всех, не показывая @",
  category: "Группы",
  isGroup: true,
  isAdmin: true,
  use: "(*войдите* _или ответьте на_ *текст*",
  run: async (client, m, args) => {
    const text = args.join(" ");
    const groupMetadata = m.isGroup
      ? await client.groupMetadata(m.chat).catch(() => null)
      : null;
    const groupParticipants =
      groupMetadata?.participants?.map((p) => p.id) || [];
    const mentions = groupParticipants.map((jid) => client.decodeJid(jid));

    if (!m.quoted && !text) {
      return m.reply(`*Введите* _текст или_ *ответить* _на одно из них_`);
    }

    const q = m.quoted ? m.quoted : m;

    let mime = q.mimetype || q.mediaType || "";
    if (!mime) {
      if (q.message?.imageMessage) mime = "image";
      else if (q.message?.videoMessage) mime = "video";
      else if (q.message?.stickerMessage) mime = "sticker";
      else if (q.message?.audioMessage) mime = "audio";
    }

    const isMedia = /image|video|sticker|audio/.test(mime);
    const finalText = text || q?.text || q?.body || "";

    try {
      if (q && isMedia) {
        const media = await q.download();
        if (q.mtype === "imageMessage") {
          return client.sendMessage(
            m.chat,
            { image: media, caption: finalText, mentions },
            { quoted: null },
          );
        } else if (q.mtype === "videoMessage") {
          return client.sendMessage(
            m.chat,
            {
              video: media,
              mimetype: "video/mp4",
              caption: finalText,
              mentions,
            },
            { quoted: null },
          );
        } else if (q.mtype === "audioMessage") {
          return client.sendMessage(
            m.chat,
            {
              audio: media,
              mimetype: "audio/mp4",
              fileName: "hidetag.mp3",
              mentions,
            },
            { quoted: null },
          );
        } else if (q.mtype === "stickerMessage") {
          return client.sendMessage(
            m.chat,
            { sticker: media, mentions },
            { quoted: null },
          );
        }
      }

      return client.sendMessage(
        m.chat,
        { text: finalText, mentions },
        { quoted: null },
      );
    } catch (e) {
      console.error(e);
      return m.reply("_Ошибка при отправке помеченного сообщения_\n\n" + e);
    }
  },
};
