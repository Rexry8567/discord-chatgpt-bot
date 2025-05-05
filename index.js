import { Client, GatewayIntentBits } from "discord.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once("ready", () => {
  console.log(`Bot aktif sebagai ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith("!ask")) return;

  const prompt = message.content.replace("!ask", "").trim();

  try {
    const gptRes = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const reply = gptRes.data.choices[0].message.content;
    message.reply(reply.slice(0, 2000));
  } catch (err) {
    message.reply("Terjadi kesalahan saat menghubungi ChatGPT.");
    console.error(err);
  }
});

client.login(process.env.DISCORD_TOKEN);
