const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.user = require("./user.model")(mongoose)
db.beacon = require("./beacon.model")(mongoose)
db.site = require("./site.model")(mongoose)
db.v = require("./v.model")(mongoose)
module.exports = db;