// Utility function, that sends a sticker and a message
async function sendMessageWithSticker(bot, chatId, stickerUrl, message) {
  await bot.sendSticker(chatId, stickerUrl);
  await bot.sendMessage(chatId, message, {
    parse_mode: "HTML",
  });
}

// Utility function, adds zero to numbers less that 10
const getFormattedNumber = (num) => (num < 10 ? "0" + num : num);

// Utility function, that sets correct prefix
const gamesPlayedPrefix = (count) =>
  count % 10 >= 2 && count % 10 <= 4 ? "раза" : "раз";

module.exports = {
  sendMessageWithSticker,
  getFormattedNumber,
  gamesPlayedPrefix,
};
