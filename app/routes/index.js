module.exports = (app) => {
    require("./auth.routes")(app);
    require("./app.route")(app)
}