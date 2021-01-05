import { Message } from 'discord.js';
import { isAdminRole } from '../middlewares/checkPermission';
import { Config } from '../types/config';

export const greeting = (config: Config, message: Message) => {

  if (message.content !== '!greet') return;
  if (!isAdminRole(config, message)) return;

  message.channel.send('Hello, admin!');

}