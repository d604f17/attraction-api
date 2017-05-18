'use strict';

var _main = require('./main.js');

var _main2 = _interopRequireDefault(_main);

var _lonelyplanetApi = require('lonelyplanet-api');

var _lonelyplanetApi2 = _interopRequireDefault(_lonelyplanetApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var attractions = new _main2.default({
  flickr: '85f11febb88e3a4d49342a95b7bcf1e8',
  geocode: 'AIzaSyDfZBp51fjQZwk4QogCZIUtRaz8z96G0Ks'
}, 10);

attractions.query('denmark/copenhagen').then(function (sights) {
  console.log(sights);
}).catch(console.error);
//# sourceMappingURL=test.js.map