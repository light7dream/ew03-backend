module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            mac: String,
            name: String,
            location: Object,
            address: String,
            battery: Number,
            rssi: Number,
            description: String,
            site: {
                type: mongoose.Schema.Types.ObjectID, ref: 'sites'
            },
        },
        { timestamps: true }
    );

    const Beacon = mongoose.model("beacons", schema);
    return Beacon;
};
