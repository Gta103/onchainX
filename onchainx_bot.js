require("dotenv").config();
const { Telegraf } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

// Start Command
bot.start((ctx) => {
    ctx.reply("👋 Welcome to OnchainX Bot! Use /help to see available commands.");
});

// Help Command
bot.command("help", (ctx) => {
    ctx.reply(
        "📜 Available Commands:\n" +
        "/start - Start the bot and welcome the user\n" +
        "/help - Show a list of available commands\n" +
        "/price - Get the current price of a cryptocurrency\n" +
        "/balance - Check the user’s balance on OnchainX\n" +
        "/tx - Search for a transaction on the blockchain\n" +
        "/wallet - Get information about the user’s wallet\n" +
        "/stats - View blockchain network statistics\n" +
        "/support - Contact support for assistance"
    );
});

// Price Command (Dummy Response)
bot.command("price", (ctx) => {
    ctx.reply("💰 The current price of BTC is $50,000 (example).");
});

// Balance Command (Dummy Response)
bot.command("balance", (ctx) => {
    ctx.reply("🔢 Your OnchainX balance is 0.5 ETH.");
});

// Transaction Command
bot.command("tx", (ctx) => {
    ctx.reply("🔍 Please provide a transaction hash to search for.");
});

// Wallet Command
bot.command("wallet", (ctx) => {
    ctx.reply("🔑 Your wallet details will be shown here.");
});

// Stats Command
bot.command("stats", (ctx) => {
    ctx.reply("📊 Blockchain network statistics:\nBlocks: 1000000\nTransactions: 5000000");
});

// Support Command
bot.command("support", (ctx) => {
    ctx.reply("📞 Contact support: support@onchainx.com");
});

// Handle Unknown Commands
bot.on("text", (ctx) => {
    ctx.reply("❌ Unrecognized command. Say what?");
});

// Launch the Bot
bot.launch();
console.log("🤖 Bot is running...");
