
// Returns a random element from an array.
// Array -> Any
const randomPluck = array => 
  array[Math.floor(Math.random() * array.length)];


const colors = [
  'Blue',
  'BlueViolet',
  'CadetBlue',
  'Chocolate',
  'Coral',
  'DodgerBlue',
  'Firebrick',
  'GoldenRod',
  'Green',
  'HotPink',
  'OrangeRed',
  'Red',
  'SeaGreen',
  'SpringGreen',
  'YellowGreen'
];


export const setRandomColor = client => {

  const color = randomPluck(colors);

  return client.color(color);
};
