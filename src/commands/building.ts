import { Client, Message, Permissions, Role } from 'discord.js';
import { isAdminRole } from '../middlewares/checkPermission';
import { Config } from '../types/config';

export const building = async (config: Config, message: Message) => {

  const [command, buildName, templateName] = message.content.split(' ');

  if (command !== '!build') return;
  if (!buildName || !templateName) return;
  if (!isAdminRole(config, message)) return;

  // find template
  const template = config.templates.find((temp) => {
    return temp.name === templateName;
  });
  if (!template) return;

  const channelManager = message.guild?.channels;
  const roleManager = message.guild?.roles;
  if (!channelManager || !roleManager) return;

  // create category
  const category = await channelManager.create(buildName, {
    type: 'category',
    permissionOverwrites: [
      {
        id: roleManager.everyone.id,
        deny: [
          Permissions.FLAGS.VIEW_CHANNEL
        ],
        type: 'role',
      },
      {
        id: config.roles.admin,
        allow: [
          Permissions.FLAGS.VIEW_CHANNEL
        ],
        type: 'role',
      },
    ],
  });

  // create roles
  const roles = await Promise.all(template.roles.map(async (role) => {
    const created = await roleManager.create({
      data: {
        name: role.name,
      }
    });

    return {
      id: role.id,
      role: created,
    };
  }));

  // create channels
  const textChannelPromise = template.channels.text.map((channel) => {
    const allows = roles.filter((role) => {
      return channel.available.includes(role.id);
    });

    channelManager.create(channel.name, {
      type: 'text',
      parent: category,
      permissionOverwrites: [
        {
          id: roleManager.everyone.id,
          deny: [
            Permissions.FLAGS.VIEW_CHANNEL
          ],
          type: 'role',
        },
        {
          id: config.roles.admin,
          allow: [
            Permissions.FLAGS.VIEW_CHANNEL
          ],
          type: 'role',
        },
        ... allows.map((allow) => {
          return {
            id: allow.role.id,
            allow: [
              Permissions.FLAGS.VIEW_CHANNEL
            ]
          }
        })
      ]
    });
  });

  const voiceChannelPromise = template.channels.voice.map((channel) => {
    const allows = roles.filter((role) => {
      return channel.available.includes(role.id);
    });

    channelManager.create(channel.name, {
      type: 'voice',
      parent: category,
      permissionOverwrites: [
        {
          id: roleManager.everyone.id,
          deny: [
            Permissions.FLAGS.VIEW_CHANNEL
          ],
          type: 'role',
        },
        {
          id: config.roles.admin,
          allow: [
            Permissions.FLAGS.VIEW_CHANNEL
          ],
          type: 'role',
        },
        ... allows.map((allow) => {
          return {
            id: allow.role.id,
            allow: [
              Permissions.FLAGS.VIEW_CHANNEL
            ]
          }
        })
      ]
    });
  });

  Promise.all([textChannelPromise, voiceChannelPromise]).then(() => {
    message.channel.send(`Succeeded to build with category [${buildName}] and template [${templateName}].`);
  });
}