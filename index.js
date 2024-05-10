require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const sequelize = require("./utils/db");
const UserModel = require("./models/user.model");
const {
  sendMessageWithSticker,
  getFormattedNumber,
  gamesPlayedPrefix,
} = require("./utils/utils");
const {
  reinitializeAttempts,
  handleNewNumber,
} = require("./utils/guess-number");

const chats = {};

let isPlaying = false;
let isAskingForSupport = false;

const bot = new TelegramBot(process.env.BOT_API_KEY, { polling: true });
const requestBot = new TelegramBot(process.env.REQUEST_BOT_API_KEY, {
  polling: true,
});

try {
  sequelize.sync();
  console.log("Подключились к БД");
} catch (err) {
  console.log(err);
}

const { menuCommands, menuCommandsReplies } = require("./utils/commands");
bot.setMyCommands(menuCommands);

bot.on("message", async (ctx) => {
  const text = ctx.text;
  const chatId = ctx.chat.id;

  if (isAskingForSupport) {
    isAskingForSupport = false;

    let userName = "";
    if (ctx.from.username) {
      userName = `@${ctx.from.username}`;
    } else {
      userName = ctx.from.first_name;
    }

    const now = new Date();

    await requestBot.sendMessage(
      process.env.MY_USER_ID,
      `
        <b>👤 Пользователь: ${userName} 
        \n📅 Дата: ${now.toLocaleDateString("ru-RU")} 
        \n⌚ Время: ${getFormattedNumber(now.getHours())}:${getFormattedNumber(
        now.getMinutes()
      )}:${getFormattedNumber(now.getSeconds())}
        \n✉ Сообщение: ${text}
        </b>
      `,
      {
        parse_mode: "HTML",
      }
    );

    return bot.sendMessage(
      chatId,
      "Отправленно успешно! ✅ \nЖдите ответа от нашей команды."
    );
  }

  // If the number is between 1...10 and the game is on, handle message.
  if (parseInt(text) > 0 && parseInt(text) < 11 && isPlaying) {
    const data = parseInt(text);

    if (isPlaying) {
      handleNewNumber(bot, ctx, chatId, data, chats[chatId], false);
    }

    if (data === chats[chatId]) {
      isPlaying = false;
    }

    return;
  }

  // Handle different commands
  if (text === "/start") {
    const user = await UserModel.findOne({
      where: {
        chatId: chatId,
      },
    });

    if (!user) {
      let name = "";
      if (ctx.from.username) {
        name = `@${ctx.from.username}`;
      } else {
        name = ctx.from.first_name;
      }
      await UserModel.create({ chatId, userName: name });
    }

    return sendMessageWithSticker(
      bot,
      chatId,
      menuCommandsReplies[text].stickerURL,
      !user
        ? menuCommandsReplies[text].message1
        : menuCommandsReplies[text].message2
    );
  } else if (text === "/game") {
    const user = await UserModel.findOne({
      where: {
        chatId: chatId,
      },
    });
    user.gamesPlayed++;
    await user.save();

    // Set variables to initial state
    isPlaying = true;
    reinitializeAttempts();

    // Get random Number
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    chats[chatId] = randomNumber;

    sendMessageWithSticker(
      bot,
      chatId,
      menuCommandsReplies[text].stickerURL,
      menuCommandsReplies[text].message
    );

    const gameOptions = require("./utils/game-options");

    return bot.sendMessage(chatId, "Попробуй угадать!)", {
      reply_markup: {
        inline_keyboard: gameOptions,
        resize_keyboard: true,
      },
    });
  } else if (text === "/statistic") {
    const user = await UserModel.findOne({
      where: {
        chatId: chatId,
      },
    });

    const joinedBotDate = new Date(user.createdAt);

    return sendMessageWithSticker(
      bot,
      chatId,
      menuCommandsReplies[text].stickerURL,
      `<b>⌚ Вы присоединились:</b> ${joinedBotDate.toLocaleDateString(
        "ru-RU"
      )} в ${getFormattedNumber(joinedBotDate.getHours())}:${getFormattedNumber(
        joinedBotDate.getMinutes()
      )}:${getFormattedNumber(joinedBotDate.getSeconds())}\n
<b>😲 Вы сыграли:</b> ${user.gamesPlayed} ${gamesPlayedPrefix(
        user.gamesPlayed
      )}\n
<b>❌ Неправильных ответов:</b> ${user.wrongAnswers}\n
<b>👎 Поражений:</b> ${user.losses}\n
<b>🏆 Побед:</b> ${user.wins}
      `
    );
  } else if (text === "/strategy") {
    return sendMessageWithSticker(
      bot,
      chatId,
      menuCommandsReplies[text].stickerURL,
      menuCommandsReplies[text].message
    );
  } else if (text === "/support") {
    isAskingForSupport = true;
    return sendMessageWithSticker(
      bot,
      chatId,
      menuCommandsReplies[text].stickerURL,
      menuCommandsReplies[text].message
    );
  }

  return bot.sendMessage(
    chatId,
    `Я тебя не понимаю... \n\nЕсли уже играешь, то введи число от 1 до 10. \n\nЕсли ещё не начал игру, то начни новую игру! 😆`
  );
});

// Callback functions, when inline keyboard is clicked
bot.on("callback_query", async (ctx) => {
  const data = parseInt(ctx.data);
  const chatId = ctx.message.chat.id;

  if (!isPlaying) {
    return bot.answerCallbackQuery(ctx.id, {
      text: "Начни новую игру...",
    });
  }
  handleNewNumber(bot, ctx, chatId, data, chats[chatId], true);

  if (data === chats[chatId]) {
    isPlaying = false;
  }
});
