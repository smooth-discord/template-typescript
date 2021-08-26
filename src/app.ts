import root from "app-root-path";
import { Client, Intents } from "discord.js";
import {
  BaseButton,
  BaseCommand,
  BaseSelectMenu,
  getButtons,
  getGlobalCommands,
  getGuildCommands,
  getSelectMenus,
  registerGlobalCommands,
  registerGuildCommands,
} from "smooth-discord";
import dotenv from "dotenv";
dotenv.config();

let commands: { global: BaseCommand[]; guild: BaseCommand[] } = {
  global: [],
  guild: [],
};
let buttons: BaseButton[] = [];
let selectMenus: BaseSelectMenu[] = [];

const client = new Client({
  intents: Intents.FLAGS.GUILDS | Intents.FLAGS.GUILD_MESSAGES,
});

client.once("ready", async () => {
  commands.global = await getGlobalCommands(`${root}/dist/commands/global`);
  commands.guild = await getGuildCommands(`${root}/dist/commands/guild`);
  buttons = await getButtons(`${root}/dist/buttons`);
  selectMenus = await getSelectMenus(`${root}/dist/selectMenus`);

  await registerGlobalCommands(client, commands.global);
  await registerGuildCommands(client, commands.guild);

  console.log("bot is ready...");
});

client.on("interactionCreate", (interaction) => {
  if (interaction.isCommand()) {
    const command =
      commands.guild.find((value) => value.name === interaction.commandName) ||
      commands.global.find((value) => value.name === interaction.commandName);
    if (command) {
      command.execute(interaction);
    } else {
      interaction.reply({
        content: "The command is no longer supported.",
        ephemeral: true,
      });
    }
  } else if (interaction.isButton()) {
    const button = buttons.find(
      (value) => value.component.customId === interaction.customId
    );
    if (button) {
      button.execute(interaction);
    } else {
      interaction.reply({
        content: "The button is no longer supported.",
        ephemeral: true,
      });
    }
  } else if (interaction.isSelectMenu()) {
    const selectMenu = selectMenus.find(
      (value) => value.component.customId === interaction.customId
    );
    if (selectMenu) {
      selectMenu.execute(interaction);
    } else {
      interaction.reply({
        content: "The menu is no longer supported.",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.BOT_TOKEN);
