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
    app.post('/api/beacons/checkEditMAC', controller.checkEditMAC);
    //Audit
    app.post('/api/audit/saveAuditGroup', controller.saveAuditGroup);
    app.post('/api/audit/updateAuditGroup', controller.updateAuditGroup);
    app.post('/api/audit/getAllAuditGroups', controller.getAllAuditGroups);
    app.post('/api/audit/deleteGroup', controller.deleteGroup);
    app.post('/api/audit/getGroupBeacons', controller.getGroupBeacons);
    //User
    app.post('/api/users/getUsers', controller.getUsers);
    app.post('/api/users/createUser', controller.createUser);
    app.post('/api/users/updateUser', controller.updateUser);
    app.post('/api/users/deleteUser', controller.deleteUser);
    

    app.post('/api/v/', controller.v);

};
