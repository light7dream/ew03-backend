const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});

	app.post("/api/signup", [verifySignUp.checkDuplicateUsernameOrEmail], controller.signup);

	app.post("/api/signin", controller.signin);
	app.post("/api/verify-email", controller.checkEmail);
	app.post("/api/reset-password", controller.resetPassword);
	app.post("/api/update-account", controller.updateAccount);
};
