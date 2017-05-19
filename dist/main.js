'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lonelyplanetApi = require('lonelyplanet-api');

var _lonelyplanetApi2 = _interopRequireDefault(_lonelyplanetApi);

var _flickrApi = require('flickr-api');

var _flickrApi2 = _interopRequireDefault(_flickrApi);

var _geocodeApi = require('geocode-api');

var _geocodeApi2 = _interopRequireDefault(_geocodeApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getLocations = function getLocations(sights, geocode) {
  var geocodes = sights.map(function (sight) {
    return geocode.query(sight.city.country + ' ' + sight.city.city + ' ' + sight.name);
  });

  return new Promise(function (resolve) {
    Promise.all(geocodes).then(function (geocodes) {
      geocodes = geocodes.filter(function (geocodes) {
        return geocodes.status === 'OK';
      });

      var locations = geocodes.map(function (geocode) {
        return geocode.results[0].geometry.location;
      });

      resolve(sights.map(function (sight, index) {
        return Object.assign(sight, locations[index]);
      }));
    });
  });
};

var getPopularity = function getPopularity(sights, flickr) {
  var photos = sights.map(function (sight) {
    return flickr.query('photos.search', {
      lat: sight.lat,
      lon: sight.lng,
      text: sight.name
    });
  });

  return new Promise(function (resolve) {
    Promise.all(photos).then(function (data) {
      var populaties = data.map(function (photos) {
        return photos.photos.total;
      });

      resolve(sights.map(function (sight, index) {
        return Object.assign(sight, { popularity: parseInt(populaties[index]) });
      }));
    });
  });
};

var AttractionAPI = function () {
  function AttractionAPI(apiKeys) {
    var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, AttractionAPI);

    this.limit = limit;
    this.flickr = new _flickrApi2.default(apiKeys.flickr, 'json');
    this.geocode = new _geocodeApi2.default(apiKeys.geocode, 'json');
    this.lp = new _lonelyplanetApi2.default();
  }

  _createClass(AttractionAPI, [{
    key: 'query',
    value: function query(city) {
      var _this = this;

      return new Promise(function (resolve) {
        _this.lp.city(city).then(function (city) {
          return city.sights();
        }).then(function (sights) {
          sights.splice(50);
          return getLocations(sights, _this.geocode);
        }).then(function (sights) {
          return getPopularity(sights, _this.flickr);
        }).then(function (sights) {
          sights.sort(function (a, b) {
            return b.popularity - a.popularity;
          });
          resolve(sights);
        }).catch(console.log);
      });
    }
  }]);

  return AttractionAPI;
}();

exports.default = AttractionAPI;
