module.exports = mongoose => {
    var schema = mongoose.Schema({
        title: String,
        description: String,
        },
        {timestamps: true}
    );

    const AuditGroup = mongoose.model("auditgroup", schema);
    return AuditGroup;
};