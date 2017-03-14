'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _lonelyplanetApi = require('lonelyplanet-api');

var _lonelyplanetApi2 = _interopRequireDefault(_lonelyplanetApi);

var _flickrApi = require('flickr-api');

var _flickrApi2 = _interopRequireDefault(_flickrApi);

var _geocodeApi = require('geocode-api');

var _geocodeApi2 = _interopRequireDefault(_geocodeApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var flickr = new _flickrApi2.default('85f11febb88e3a4d49342a95b7bcf1e8', 'json');
var geocode = new _geocodeApi2.default('AIzaSyDfZBp51fjQZwk4QogCZIUtRaz8z96G0Ks', 'json');
var lp = new _lonelyplanetApi2.default();

app.get('/', function (req, res) {
    res.json({
        name: 'attractions-api',
        version: '0.0.1',
        authors: ['Rasmus Nørskov (rhnorskov)', 'Mathias Wieland (mathias.wieland)', 'Andreas Sommerset (asomm)']
    });
});

app.get('/:country*', function (req, res) {
    lp.city(req.params.country + req.params[0]).then(function (city) {
        return city.sights();
    }).then(function (sights) {
        sights.splice(5);

        var geocodes = sights.map(function (sight) {
            return geocode.query(sight.city.country + ' ' + sight.city.city + ' ' + sight.name);
        });

        return new Promise(function (resolve, reject) {
            Promise.all(geocodes).then(function (data) {
                var locations = data.map(function (geocode) {
                    return geocode.results[0].geometry.location;
                });

                resolve(sights.map(function (sight, index) {
                    return Object.assign(sight, locations[index]);
                }));
            }).catch(reject);
        });
    }).then(function (sights) {
        var photos = sights.map(function (sight) {
            return flickr.query('photos.search', {
                lat: sight.lat,
                lon: sight.lng,
                text: sight.name
            });
        });

        return new Promise(function (resolve, reject) {
            Promise.all(photos).then(function (data) {
                var populaties = data.map(function (photos) {
                    return photos.photos.total;
                });

                resolve(sights.map(function (sight, index) {
                    return Object.assign(sight, { popularity: parseInt(populaties[index]) });
                }));
            }).catch(reject);
        });
    }).then(function (sights) {
        res.json(sights);
    }).catch(console.error);
});

app.listen(process.env.port || 3000);
//# sourceMappingURL=main.js.map