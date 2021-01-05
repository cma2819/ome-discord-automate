import { Client } from 'discord.js';
import { building } from './commands/building';
import { greeting } from './commands/greeting';
import { Config } from './types/config';

export const command = (config: Config) => {
  const client = new Client();
  
  client.on('ready', () => {
    console.log('Wake up discord automate bot!');
  });

  client.on('message', async (msg) => {
    try {
      greeting(config, msg);
      building(config, msg);
    } catch (e) {
      console.error(e);
      msg.channel.send('Error happened :(');
    }
  });
  
  client.login(config.botToken);
}