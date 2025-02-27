const { Telegraf } = require("telegraf");
const { ethers } = require("ethers");
const axios = require("axios");
const { AlphaRouter } = require("@uniswap/smart-order-router");

const BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN";
const INFURA_URL = "https://mainnet.infura.io/v3/YOUR_INFURA_KEY";
const BINANCE_API = "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=14";
const UNISWAP_ROUTER = new AlphaRouter({ chainId: 1, provider: new ethers.providers.JsonRpcProvider(INFURA_URL) });

const bot = new Telegraf(BOT_TOKEN);
const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);

// 1?? Get Wallet Balance
bot.command("wallet", async (ctx) => {
    const args = ctx.message.text.split(" ");
    if (args.length < 2) return ctx.reply("? Enter the wallet address: /wallet 0x...");
    const address = args[1];
    const balance = await provider.getBalance(address);
    ctx.reply(`?? Balance: ${ethers.utils.formatEther(balance)} ETH`);
});

// 2?? Track New Coins
bot.command("newcoins", async (ctx) => {
    const res = await axios.get("https://api.coingecko.com/api/v3/coins/list");
    const newCoins = res.data.slice(-5).map(c => c.name).join("\n");
    ctx.reply(`?? Latest coins:
${newCoins}`);
});

// 3?? Market Analysis (SMA - Simple Moving Average)
bot.command("sma", async (ctx) => {
    const res = await axios.get(BINANCE_API);
    const closes = res.data.map(c => parseFloat(c[4]));
    const sma = closes.reduce((sum, close) => sum + close, 0) / closes.length;
    ctx.reply(`?? SMA for BTC: ${sma.toFixed(2)} USD`);
});

// 4?? Execute a Trade on Uniswap
bot.command("swap", async (ctx) => {
    const args = ctx.message.text.split(" ");
    if (args.length < 3) return ctx.reply("? Usage: /swap 0xTokenAddress 0.1");
    const [_, tokenAddress, amount] = args;
    const trade = await UNISWAP_ROUTER.route(ethers.utils.parseEther(amount), tokenAddress, 1, "YOUR_WALLET", Date.now() + 600000);
    if (!trade) return ctx.reply("? No available route.");
    ctx.reply(`? Successful trade! Hash: ${trade.methodParameters}`);
});

bot.launch();
console.log("?? Bot is running...");
