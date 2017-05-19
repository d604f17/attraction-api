import AttractionAPI from './main.js';
import LonelyPlanet from 'lonelyplanet-api';

const attractions = new AttractionAPI({
  flickr: '85f11febb88e3a4d49342a95b7bcf1e8',
  geocode: 'AIzaSyDfZBp51fjQZwk4QogCZIUtRaz8z96G0Ks',
}, 10);

attractions.query('denmark/copenhagen').then(sights => {
  console.log(sights.length);
}).catch(console.error);
