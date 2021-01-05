import { Message } from 'discord.js';
import { Config } from '../types/config';

export const isAdminRole = async (config: Config, message: Message) => {
  const author = message.author;
  const adminRole = await message.guild?.roles.fetch(config.roles.admin);
  if (!adminRole) {
    return false;
  }

  if (!adminRole.members.get(author.id)) {
    return false;
  }

  return true;
}