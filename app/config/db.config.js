module.exports = () => {
	const db = require("../models");
	db.mongoose
	.connect(process.env.MONGODB, {
  		useNewUrlParser: true,
  		useUnifiedTopology: true
	})
	.then(() => {
  		console.log("Connected to the database!");
	})
	.catch(err => {
  		console.log("Cannot connect to the database!", err);
  		process.exit();
	});
}