module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            device: String,
            data: String,
        },
        { timestamps: true }
    );

    const V = mongoose.model("logs", schema);
    return V;
};
