import { Template } from './template';

export type Config = {
  botToken: string;
  roles: {
    admin: string;
  },
  templates: Template[]
}