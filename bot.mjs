

import {config} from 'dotenv';
import tmi      from 'tmi.js';


config();


const client = new tmi.Client({
  channels: [process.env.TWITCH_CHANNEL_NAME]
});

client.connect();

client.on('message', (channel, tags, message, self) => {

  // "Alca: Hello, World!"
  console.log(`${tags['display-name']}: ${message}`);
});
