import { Client, Intents } from "discord.js";
import {
  BaseButton,
  BaseCommand,
  getButtons,
  getGlobalCommands,
  getGuildCommands,
  registerGlobalCommands,
  registerGuildCommands,
} from "smooth-discord";
import dotenv from "dotenv";
dotenv.config();

let commands: { global: BaseCommand[]; guild: BaseCommand[] };
let buttons: BaseButton[];

const client = new Client({
  intents: Intents.FLAGS.GUILDS | Intents.FLAGS.GUILD_MESSAGES,
});

client.once("ready", async () => {
  commands.global = await getGlobalCommands();
  commands.guild = await getGuildCommands();
  buttons = await getButtons();

  await registerGlobalCommands(client, commands.global);
  await registerGuildCommands(client, commands.guild);

  console.log("bot is ready...");
});

client.login(process.env.BOT_TOKEN);
