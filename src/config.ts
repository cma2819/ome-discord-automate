import { Channel, Role } from 'discord.js';
import { readdirSync, readFileSync } from 'fs';
import { extname, join } from 'path';
import { Config } from './types/config';
import { Template } from './types/template';

const botToken = process.env.DISCORD_BOT_TOKEN;
if (!botToken) {
  throw new Error('Bot token is not set.');
}

const adminRole = process.env.ROLE_ID_ADMIN;
if (!adminRole) {
  throw new Error('Admin role ID is not set.');
}

const isRole = (role: any): role is Role => {
  if (
    typeof role.id !== 'string'
    || typeof role.name !== 'string'
  ) {
    console.error(JSON.stringify(role) + ' is not Role.');
    return false;
  }

  return true;
}

const isChannel = (channel: any): channel is Channel => {
  if (
    typeof channel.id !== 'string'
    || typeof channel.name !== 'string'
    || !Array.isArray(channel.available)
  ) {
    console.error(JSON.stringify(channel) + ' is not Channel.');
    return false;
  }

  if (
    channel.available.some((available: any) => {
      return typeof available !== 'string'
    })
  ) {
    console.error(JSON.stringify(channel.available) + ' is not string array.');
    return false;
  }

  return true;
}

const isTemplate = (json: any): json is Template => {
  if (typeof json.name !== 'string'
    || !Array.isArray(json.roles)
    || !Array.isArray(json.channels.text)
    || !Array.isArray(json.channels.voice)) {

    return false;
  }

  if (json.roles.some((role: any) => {
      return !isRole(role);
    })) {

    return false;
  }

  if (json.channels.text.some((channel: any) => {
    return !isChannel(channel)
  })) {
    return false;
  }

  if (json.channels.voice.some((channel: any) => {
    return !isChannel(channel)
  })) {
    return false;
  }

  return true;
}

const templateDir = join(__dirname, '../templates');
const templates = readdirSync(templateDir);

const templateConfig = templates.filter((filename) => {
  return extname(filename).toLowerCase() === '.json';
}).map((filename) => {
  const json = readFileSync(join(templateDir, filename));
  const template = JSON.parse(json.toString());
  if (!isTemplate(template)) {
    throw new Error('Parse error, json = ' + json.toString());
  }
  return template;
});

export const config: Config = {
  botToken,
  roles: {
    admin: adminRole,
  },
  templates: templateConfig
}

