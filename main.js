import LonelyPlanet from 'lonelyplanet-api';
import Flickr from 'flickr-api';
import Geocode from 'geocode-api';

const getLocations = (sights, geocode) => {
  let geocodes = sights.map(sight => {
    return geocode.query(`${sight.city.country} ${sight.city.city} ${sight.name}`);
  });

  return new Promise(resolve => {
    Promise.all(geocodes).then(geocodes => {
      geocodes = geocodes.filter(geocodes => geocodes.status === 'OK');

      let locations = geocodes.map(geocode => {
        return geocode.results[0].geometry.location;
      });

      resolve(sights.map((sight, index) => {
        return Object.assign(sight, locations[index]);
      }));
    });
  });
};

const getPopularity = (sights, flickr) => {
  let photos = sights.map(sight => (
      flickr.query('photos.search', {
        lat: sight.lat,
        lon: sight.lng,
        text: sight.name,
      })
  ));

  return new Promise(resolve => {
    Promise.all(photos).then(data => {
      let populaties = data.map(photos => {
        return photos.photos.total;
      });

      resolve(sights.map((sight, index) => {
        return Object.assign(sight, {popularity: parseInt(populaties[index])});
      }));
    });
  });
};

class AttractionAPI {
  constructor(apiKeys, limit = 0) {
    this.limit = limit;
    this.flickr = new Flickr(apiKeys.flickr, 'json');
    this.geocode = new Geocode(apiKeys.geocode, 'json');
    this.lp = new LonelyPlanet();
  }

  query(city) {
    return new Promise(resolve => {
      this.lp.city(city).then(city => {
        return city.sights();
      }).then(sights => {
        sights.splice(50);
        return getLocations(sights, this.geocode);
      }).then(sights => {
        return getPopularity(sights, this.flickr);
      }).then(sights => {
        sights.sort((a, b) => b.popularity - a.popularity);
        resolve(sights);
      }).catch(console.log);
    });
  }
}

export default AttractionAPI;


