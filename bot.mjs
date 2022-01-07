

import dotenv from 'dotenv';
import tmi    from 'tmi.js';
import {hits} from './toxicity.mjs';


dotenv.config();




const client = new tmi.Client({
  channels: [process.env.TWITCH_CHANNEL_NAME]
});



// const client = new tmi.Client({
//   channels: ['bomb_phonkey']
// });

// const client = new tmi.Client({
//   channels: ['kaitiac']
// });



client.connect();

// client.on('message', (channel, tags, message, self) => {

//   // "Alca: Hello, World!"
//   console.log(`${tags['display-name']}: ${message}`);
// });


client.on('message', async (channel, tags, message, self) => {

  // // "Alca: Hello, World!"
  // console.log(`${tags['display-name']}: ${message}`);


  // ['identity_attack', 'insult', 'obscene', 'severe_toxicity', 
  //  'sexual_explicit', 'threat', 'toxicity']
  const {labels, sentences} = await hits(message);

  const {identity_attack, severe_toxicity, sexual_explicit} = labels;


  if (!identity_attack && !severe_toxicity && !sexual_explicit) { return; }


  const isToxic = Boolean(Object.keys(labels).length);

  if (isToxic) {
    console.log(labels, ' : ', tags['display-name'], ' : ', sentences);
  }

});
