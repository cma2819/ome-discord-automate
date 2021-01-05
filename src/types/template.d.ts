export type Template = {
  name: string;
  roles: Role[],
  channels: {
    text: Channel[],
    voice: Channel[],
  };
}

export type Role = {
  id: string;
  name: string;
}

export type Channel = {
  id: string;
  name: string;
  available: string[];
}