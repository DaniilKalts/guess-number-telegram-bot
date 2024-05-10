/* THIS FILE CONTAINS LOGIC FOR GUESSING A NUMBER */

const UserModel = require("../models/user.model");
const replyStickers = [
  "https://api.fstik.app//file/CAACAgUAAxUAAWY6_G0MVmGqKmNaYu9i0cDYv05zAAL_CwACqKroVR8GpaZStuP2NQQ/sticker.webp",
  "https://api.fstik.app//file/CAACAgUAAxUAAWY6_G3OY0gLLzIP8TBeVqmj4xC4AAJYDAAC21foVcXvOnNmBD3SNQQ/sticker.webp",
  "https://api.fstik.app//file/CAACAgUAAxUAAWY6_G2OT1KCfReSNcxdXY_JmO6OAAKtCwACzxDoVTMjVVSkOonGNQQ/sticker.webp",
  "https://api.fstik.app//file/CAACAgUAAxUAAWY6_G1tdoPvRwr5ya9tMXsC2_8XAAJ2DAACshLoVd1BulLd-80YNQQ/sticker.webp",
];

// Maximum number of attempts is 4
let attempts = 4;

function reinitializeAttempts() {
  attempts = 4;
}

function getAttemptsLeftText(num) {
  switch (num) {
    case 1:
      return "1️⃣ попытка";
    case 2:
      return "2️⃣ попытки";
    case 3:
      return "3️⃣ попытки";
    case 4:
      return "4️⃣ попытки";
  }
}

async function handleNewNumber(
  bot,
  ctx,
  chatId,
  data,
  answer,
  wasKeyboardClicked
) {
  const user = await UserModel.findOne({
    where: {
      chatId: chatId,
    },
  });

  if (attempts === 0) {
    if (wasKeyboardClicked) {
      await bot.answerCallbackQuery(ctx.id, {
        text: "Начни новую игру...",
      });
    }
    return bot.sendMessage(
      chatId,
      "Ты не можешь больше продолжать эту игру, все попытки потрачены! \n\nНачни новую! 🎲 /game"
    );
  }

  attempts--;
  user.wrongAnswers++;
  await user.save();

  // If the the user guessed the number
  if (answer === data) {
    await bot.sendSticker(
      chatId,
      "https://api.fstik.app//file/CAACAgUAAxUAAWY6_G3enF06UHUEzV_gIuoNTE96AALeDAACLh3pVQrrW9sXTg7RNQQ/sticker.webp"
    );
    if (wasKeyboardClicked) {
      bot.answerCallbackQuery(ctx.id, { text: "Верно ✅" });
    }

    user.wrongAnswers--;
    user.wins++;
    await user.save();

    return bot.sendMessage(
      chatId,
      `Ты угадал! Загаданное число было - <span class="tg-spoiler">${data}</span> ✅ \n\nТебе понадобилось ${getAttemptsLeftText(
        4 - attempts
      )}.`,
      {
        parse_mode: "HTML",
      }
    );
  }

  // Send stickers depending on amount of remaining attempts
  await bot.sendSticker(chatId, replyStickers[attempts]);
  if (attempts === 0) {
    user.losses++;
    await user.save();

    if (wasKeyboardClicked) {
      await bot.answerCallbackQuery(ctx.id, {
        text: `Ты проиграл...`,
      });
    }

    return bot.sendMessage(
      chatId,
      `Ты потратил все ${getAttemptsLeftText(
        4
      )}! \nЗагаданное число было <span class="tg-spoiler">${answer}</span>.`,
      {
        parse_mode: "HTML",
      }
    );
  }

  if (answer < data) {
    await bot.sendMessage(chatId, `Загаданное число меньше, чем ${data}.`);
  } else {
    await bot.sendMessage(chatId, `Загаданное число больше, чем ${data}.`);
  }

  if (wasKeyboardClicked) {
    await bot.answerCallbackQuery(ctx.id, {
      text: `Неверно! ❌ У тебя ${
        attempts > 1 ? "осталость" : "осталась"
      } ${getAttemptsLeftText(attempts)}.`,
    });
  }
}

module.exports = { reinitializeAttempts, handleNewNumber };
