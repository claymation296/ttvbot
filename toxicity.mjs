

import {init, classify} from './tf-toxicity.mjs';

/*

  This function uses a regex that replaces common 
  english sentence seperator structures with a "pipe".
  Then it splits the string by the "pipe" to create an array
  of sentences.  

  See: https://newbedev.com/split-string-into-sentences-in-javascript

  The RegExp (see on Debuggex):

  (.+|:|!|\?) = The sentence can end not only by ".", "!" or "?", but also by "..." or ":"
  (\"|\'|)*|}|]) = The sentence can be surrounded by quatation marks or parenthesis
  (\s|\n|\r|\r\n) = After a sentense have to be a space or end of line
  g = global
  m = multiline

*/
const strToSentences = str => 
  str.replace(/(\.+|\:|\!|\?)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, '$1$2|').split('|');

// Returns the full raw output of the tf toxicity model.
export const predict = async message => {

  // await init();



  await init(0.5);





  const sentences = strToSentences(message);

  // `predictions` is an array of objects, one for each prediction head,
  // that contains the raw probabilities for each input along with the
  // final prediction in `match` (either `true` or `false`).
  // If neither prediction exceeds the threshold, `match` is `null`.
  const predictions = await classify(sentences);

  // console.log('predictions: ', predictions);
  /*
    prints:
    {
      "label": "identity_attack",
      "results": [{
        "probabilities": [0.9659664034843445, 0.03403361141681671],
        "match": false
      }]
    },
    {
      "label": "insult",
      "results": [{
        "probabilities": [0.08124706149101257, 0.9187529683113098],
        "match": true
      }]
    },
    ...
  */



   return {predictions, sentences};
};

// Returns an object containing each label as a key,
// set to a boolean value which is true if any of the
// sentences have a result where 'match' is true. 
export const labeled = async message => {

  const {predictions, sentences} = await predict(message);

  const labels = predictions.reduce((accum, prediction) => {

    const {label, results} = prediction;
    const match = results.find(entry => entry.match === true);

    accum[label] = Boolean(match);

    return accum;
  }, {});

  return {labels, sentences};
};


export const hits = async message => {

  const {labels, sentences} = await labeled(message);

  const entries = Object.entries(labels).filter(([_, val]) => val === true);

  return {labels: Object.fromEntries(entries), sentences};
};

// Returns a boolean value, used to determine of a
// message contains ANY form of toxicity.
export const isToxic = async message => {

  const {labels} = await hits(message);

  return Boolean(Object.values(labels).find(val => val === true));
};
