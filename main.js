import express from 'express';
import LonelyPlanet from 'lonelyplanet-api';

const app = express();
const lp = new LonelyPlanet();

app.get('/:country*', (req, res) => {
    lp.city(req.params.country + req.params[0])
        .then(city => {
            return city.sights();
        })
        .then(sights => {
            res.send(sights);
        })
        .catch(console.error)
});

app.listen(process.env.port || 3000);
