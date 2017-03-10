'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _lonelyplanetApi = require('lonelyplanet-api');

var _lonelyplanetApi2 = _interopRequireDefault(_lonelyplanetApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var lp = new _lonelyplanetApi2.default();

app.get('/:country*', function (req, res) {
    lp.city(req.params.country + req.params[0]).then(function (city) {
        return city.sights();
    }).then(function (sights) {
        res.send(sights);
    }).catch(console.error);
});

app.listen(process.env.port || 3000);
//# sourceMappingURL=main.js.map