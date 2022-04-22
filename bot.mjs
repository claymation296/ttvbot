

import tmi              from 'tmi.js';
import {setRandomColor} from './color.mjs';

import {
  hits, 
  init as initToxicity
} from './toxicity.mjs';


const channel = process.env.TWITCH_CHANNEL_NAME;

// const channel = 'claymation296';
// const channel = 'slexify_gaming';
// const channel = 'bomb_phonkey';
// const channel = 'maddgree';
// const channel = 'rev3rend816';



const client = new tmi.Client({
  // options: { 
  //   debug:             true, 
  //   messagesLogLevel: 'info'
  // },
  connection: {
    reconnect: true,
    secure:    true
  },
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.BOT_TOKEN
  },
  channels: [channel]
});



client.on('message', async (channel, tags, message, self) => {

  // 'tags' object (subject to change by Twitch).
  //
  // {
  //   'badges': { 'broadcaster': '1', 'warcraft': 'horde' },
  //   'color': '#FFFFFF',
  //   'display-name': 'Schmoopiie',
  //   'emotes': { '25': [ '0-4' ] },
  //   'mod': true,
  //   'room-id': '58355428',
  //   'subscriber': false,
  //   'turbo': true,
  //   'user-id': '58355428',
  //   'user-type': 'mod',
  //   'emotes-raw': '25:0-4',
  //   'badges-raw': 'broadcaster/1,warcraft/horde',
  //   'username': 'schmoopiie',
  //   'message-type': 'action'
  // }

  // 'self' is true when the message is from the bot itself.
  // 'tags.message-type' is 'whisper' when a message is a DM.
  if (self || tags['message-type'] === 'whisper') { return; }

  // All possible 'tf-toxicity' labels:
  //
  // ['identity_attack', 'insult', 'obscene', 'severe_toxicity', 
  //  'sexual_explicit', 'threat', 'toxicity']
  const {labels, sentences} = await hits(message);

  const isToxic = Boolean(Object.keys(labels).length);

  if (isToxic) {
    console.log(labels, ' : ', tags['display-name'], ' : ', sentences);
  }

});


(async function() {
  try {

    // const threshold = process.env.TOXICITY_SENSITIVITY;

    // const threshold = 0.7;
    const threshold = 0.97;


    // const labels    = ['identity_attack', 'severe_toxicity', 'sexual_explicit'];

    // await initToxicity(threshold, labels);


    await initToxicity(threshold);
    


    console.log('Connecting...');

    await client.connect();

    console.log(`Connected to "${channel}".`);

    await setRandomColor(client);

    // await client.say(channel, 'hello world');
  }
  catch (error) {
    console.log('Failed to connect!');
    console.error(error);
  }
}());
