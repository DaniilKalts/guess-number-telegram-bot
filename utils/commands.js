const menuCommands = [
  {
    command: "/start",
    description: "🤖 Запуск / Перезапуск бота",
  },
  {
    command: "/statistic",
    description: "📊 Статистика о партиях",
  },
  {
    command: "/game",
    description: "🎲 Начать новую игру",
  },
  {
    command: "/strategy",
    description: "💡 Как гарантированно выиграть",
  },
  {
    command: "/support",
    description: "🛠 Техническая поддержка 🛞",
  },
];

const menuCommandsReplies = {
  "/start": {
    stickerURL:
      "https://api.fstik.app//file/AAMCBQADFQABZjr8bWtm93yDyavt55a6JZmRS74AAmsNAAL83-lVwTVCzsN2wDcBAAdtAAM1BA/sticker.webp",
    message1:
      "Добро пожаловать! 👋 \n\nСуть этого бота в том, что ты должен угадать число от 1 до 10. \nУ тебя всего 4⃣ попытки. \n\nВыбери команду /game, чтобы начать игру 🎲",
    message2:
      "Добро пожаловать вновь! 👋 \n\nТы уже в курсе, что да как тут устроено. \nТвоя статистика сохранена. Можешь посмотреть её набрав: /statistic",
  },
  "/statistic": {
    stickerURL:
      "https://api.fstik.app//file/CAACAgUAAxUAAWY8bat8t2zj3qpEL_i8H6D5_S3KAAJvCwACevXoVXpK2Hn4vI62NQQ/sticker.webp",
  },
  "/game": {
    stickerURL:
      "https://api.fstik.app//file/AAMCBQADFQABZjr8bfKJEZzedkAsTAaLAxOW86QAAs8KAAKI-uFVeBSDtqlxbCwBAAdtAAM1BA/sticker.webp",
    message: "Я загадал число от 1 до 10.",
  },
  "/strategy": {
    stickerURL:
      "https://api.fstik.app//file/CAACAgUAAxUAAWY6_G0AAQ161gABsbmUW-dFYtqbwAkAAmEMAAIxBuhVmBOH2Hpk1MM1BA/sticker.webp",
    message: `
    Представьте, что у нас есть список чисел от <b>1 до 10</b>. Мы ищем определенное число в этом списке, скажем, число <b>7</b>.
    
    1️⃣ <b>Сначала мы смотрим на середину списка.</b> В нашем случае это число 5.
    2️⃣ <b>Мы спрашиваем себя: 7 больше или меньше 5? Поскольку 7 больше, мы знаем, что число 7 должно быть справа от числа 5.</b>
    3️⃣ <b>Теперь наш список сократился</b> до чисел от 6 до 10.
    4️⃣ <b>Мы снова смотрим на середину этого списка.</b> Это число 8.
    5️⃣ <b><u>Снова задаем вопрос:</u></b> 7 больше или меньше 8? Теперь 7 меньше.
    6️⃣ Таким образом, мы знаем, что число 7 должно быть слева от числа 8.
    7️⃣ Теперь наш список сократился до чисел от 6 до 7.
    8️⃣ Мы снова смотрим на середину этого списка. Это число 6.
    9️⃣ Поскольку 7 больше 6, мы знаем, что число 7 должно быть справа от числа 6.
    🔟 Теперь наш список сократился до одного числа - числа 7.
    
    Таким образом, мы с помощью метода <b><a href="https://habr.com/ru/articles/684756/">бинарного поиска</a></b> быстро и эффективно нашли нужное число, не просматривая каждый элемент списка по отдельности.
          `,
  },
  "/support": {
    stickerURL:
      "https://api.fstik.app//file/AAMCBQADFQABZjr8bZiDgYAQ6ApV63a1tv5vN30AArUMAAKeTehVX9JuEfngepQBAAdtAAM1BA/sticker.webp",
    message:
      "<b>Сюда его! 🥊</b> \nНапиши мне в чём проблема и наша команда постарается решить её в течение следующих 2 часов.",
  },
};

module.exports = {
  menuCommands,
  menuCommandsReplies,
};
