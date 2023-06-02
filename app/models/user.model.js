module.exports = mongoose => {
	var schema = mongoose.Schema({
		name: String,
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,  // "user" , "admin" , "super"
			required: true,
		},
		sites: [
			{
				type: mongoose.Schema.Types.ObjectID,
				ref: "sites"
			}
		]
	},
		{ timestamps: true }
	);

	const User = mongoose.model("users", schema);
	return User;
};