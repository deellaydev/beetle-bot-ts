import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
} from 'discord.js';
import { CommandType } from '../typings/Commands';
import { promisify } from 'util';
import { glob } from 'glob';
import { RegisterCommandsOptions } from '../typings/client';
import { Event } from './Event';

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();

  constructor() {
    super({ intents: 32767 });
  }

  start() {
    this.registerModules()
      .then(() => console.log('Modules is registered'))
      .catch((e: Error) => console.log(e));
    this.login(process.env.BOT_TOKEN)
      .then(() => console.log('Bot is login'))
      .catch((e: Error) => console.log(e));
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  // Register Commands To Guild Or Global
  async registerCommands({ guildId, commands }: RegisterCommandsOptions) {
    if (guildId) {
      await this.guilds.cache.get(guildId)?.commands.set(commands);
      console.log(`Registering commands to ${guildId}`);
    } else {
      await this.application?.commands.set(commands);
      console.log('Registering global commands');
    }
  }

  // Register All Modules
  async registerModules() {
    // Register All Commands Modules
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await globPromise(
      `${__dirname}/../commands/*/*{.ts,.js}`
    );

    for (const filePath of commandFiles) {
      const command: CommandType = await this.importFile(filePath);
      if (!command.name) continue;
      console.log(command);

      this.commands.set(command.name, command);
      slashCommands.push(command);
    }

    this.on('ready', () => {
      this.registerCommands({
        commands: slashCommands,
        guildId: process.env.GUILD_ID,
      });
    });

    // Register All Events Modules
    const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
    for (const filePath of eventFiles) {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath);
      this.on(event.event, event.run);
    }
  }
}
