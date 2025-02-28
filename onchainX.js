require("dotenv").config();
const { Telegraf } = require("telegraf");
const { ethers } = require("ethers");
const axios = require("axios");
const { AlphaRouter } = require("@uniswap/smart-order-router");

const BOT_TOKEN = process.env.BOT_TOKEN;
const INFURA_URL = process.env.INFURA_URL;
const BINANCE_API = "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=14";

const UNISWAP_ROUTER = new AlphaRouter({
    chainId: 1,
    provider: new ethers.providers.JsonRpcProvider(INFURA_URL),
});

const bot = new Telegraf(BOT_TOKEN);
const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);

// 📌 Start Command
bot.command("start", (ctx) => {
    ctx.reply("🚀 Welcome to OnchainX Bot! Use /help to see available commands.");
});

// 📌 Help Command
bot.command("help", (ctx) => {
    ctx.reply(
        "📌 Available Commands:\n" +
        "/start - Start the bot\n" +
        "/help - Show available commands\n" +
        "/price - Get current crypto price\n" +
        "/balance <wallet_address> - Check wallet balance\n" +
        "/tx <transaction_hash> - Search blockchain transaction\n" +
        "/wallet <wallet_address> - Get wallet details\n" +
        "/stats - View blockchain network statistics\n" +
        "/swap <token_address> <amount> - Execute a Uniswap swap"
    );
});

// 📌 Get Wallet Balance
bot.command("wallet", async (ctx) => {
    try {
        const args = ctx.message.text.split(" ");
        if (args.length < 2) return ctx.reply("❌ Enter wallet address: /wallet 0x...");
        const address = args[1];

        const balance = await provider.getBalance(address);
        ctx.reply(`💰 Balance: ${ethers.utils.formatEther(balance)} ETH`);
    } catch (error) {
        ctx.reply("❌ Error fetching balance. Check the wallet address.");
    }
});

// 📌 Get Latest Coins
bot.command("newcoins", async (ctx) => {
    try {
        const res = await axios.get("https://api.coingecko.com/api/v3/coins/list");
        const newCoins = res.data.slice(-5).map((c) => c.name).join("\n");
        ctx.reply(`🆕 Latest Coins:\n${newCoins}`);
    } catch (error) {
        ctx.reply("❌ Error fetching new coins.");
    }
});

// 📌 Calculate Simple Moving Average (SMA)
bot.command("sma", async (ctx) => {
    try {
        const res = await axios.get(BINANCE_API);
        const closes = res.data.map((c) => parseFloat(c[4]));
        const sma = closes.reduce((sum, close) => sum + close, 0) / closes.length;
        ctx.reply(`📊 BTC SMA: ${sma.toFixed(2)} USD`);
    } catch (error) {
        ctx.reply("❌ Error calculating SMA.");
    }
});

// 📌 Execute Swap on Uniswap
bot.command("swap", async (ctx) => {
    try {
        const args = ctx.message.text.split(" ");
        if (args.length < 3) return ctx.reply("❌ Use: /swap 0xTokenAddress 0.1");

        const [_, tokenAddress, amount] = args;
        const trade = await UNISWAP_ROUTER.route(
            ethers.utils.parseEther(amount),
            tokenAddress,
            1,
            process.env.YOUR_WALLET,
            Date.now() + 600000
        );

        if (!trade) return ctx.reply("❌ No available route.");
        ctx.reply(`✅ Swap Successful! Details: ${JSON.stringify(trade)}`);
    } catch (error) {
        ctx.reply("❌ Error executing swap.");
    }
});

// 📌 Handle Unrecognized Commands
bot.on("text", (ctx) => {
    ctx.reply("❌ Unrecognized command. Say what?");
});

// 📌 Launch Bot
bot.launch();
console.log("🤖 Bot is running...");
