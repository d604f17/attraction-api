import express from 'express';
import LonelyPlanet from 'lonelyplanet-api';
import Flickr from 'flickr-api';
import Geocode from 'geocode-api';

const app = express();
const flickr = new Flickr('85f11febb88e3a4d49342a95b7bcf1e8', 'json');
const geocode = new Geocode('AIzaSyDfZBp51fjQZwk4QogCZIUtRaz8z96G0Ks', 'json');
const lp = new LonelyPlanet();

app.get('/', (req, res) => {
    res.json({
        name: 'attractions-api',
        version: '0.0.1',
        authors: [
            'Rasmus Nørskov (rhnorskov)',
            'Mathias Wieland (mathias.wieland)',
            'Andreas Sommerset (asomm)'
        ]
    })
});

app.get('/:country*', (req, res) => {
    lp.city(req.params.country + req.params[0])
        .then(city => {
            return city.sights();
        })
        .then(sights => {
            sights.splice(10);

            let geocodes = sights.map(sight => {
                return geocode.query(`${sight.city.country} ${sight.city.city} ${sight.name}`);
            });

            return new Promise((resolve, reject) => {
                Promise.all(geocodes)
                    .then(data => {
                        let locations = data.map(geocode => {
                            return geocode.results[0].geometry.location;
                        });

                        resolve(sights.map((sight, index) => {
                            return Object.assign(sight, locations[index]);
                        }));
                    })
                    .catch(reject);
            });
        })
        .then(sights => {
            let photos = sights.map(sight => {
                return flickr.query('photos.search', {
                    lat: sight.lat,
                    lon: sight.lng,
                    text: sight.name
                })
            });

            return new Promise((resolve, reject) => {
                Promise.all(photos)
                    .then(data => {
                        let populaties = data.map(photos => {
                            return photos.photos.total;
                        });

                        resolve(sights.map((sight, index) => {
                            return Object.assign(sight, {popularity: parseInt(populaties[index])});
                        }));
                    })
                    .catch(reject);
            });
        })
        .then(sights => {
            sights.sort((a,b) => b.popularity - a.popularity);
            res.json(sights);
        })
        .catch(console.error)
});

app.listen(process.env.port || 3000);
