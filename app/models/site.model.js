module.exports = mongoose => {
    var schema = mongoose.Schema({
        siteID: {
            type: String,
            required: true,
            unique: true,
        },
        admin: {
            type: mongoose.Schema.Types.ObjectID, ref: 'admins'
        },
    },
        { timestamps: true }
    );

    const Site = mongoose.model("sites", schema);
    return Site;
};