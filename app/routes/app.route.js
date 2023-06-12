const { authJwt } = require("../middleware");
const controller = require("../controllers/app.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post('/api/beacons', controller.getBeacons);
    app.post('/api/beacons/add', controller.addBeacon);
    app.post('/api/beacons/update', controller.updateBeacon);
    app.post('/api/beacons/delete', controller.delBeacon);
    app.post('/api/beacons/checkMAC', controller.checkMAC);
    app.post('/api/v/', controller.v);

};
