

import '@tensorflow/tfjs';
import toxicity from '@tensorflow-models/toxicity';


let model;

/*
  
  Threshold - the minimum prediction confidence.

  Labels - Default is undefined. If left undefined, all
           possible labels are used in the returned prediction.

           ['identity_attack', 'insult', 'obscene', 'severe_toxicity', 
            'sexual_explicit', 'threat', 'toxicity']
*/
export const init = async (threshold = 0.9, labels) => {

  if (model) { return; }

  if (process.env.NODE_ENV === 'development') {
    console.log('Loading model...');
  }

  // Load the model. Users optionally pass in a threshold and an array of
  // labels to include.
  model = await toxicity.load(threshold, labels);

  if (process.env.NODE_ENV === 'development') {
    console.log('Model loaded!');
  }
};


// Sentences - An array of sentence strings.
export const classify = async sentences => {

  // `predictions` is an array of objects, one for each prediction head,
  // that contains the raw probabilities for each input along with the
  // final prediction in `match` (either `true` or `false`).
  // If neither prediction exceeds the threshold, `match` is `null`.
  const predictions = await model.classify(sentences);

  // console.log(predictions);
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

   return predictions;
};
