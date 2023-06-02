const db = require("../models");
const config = require("../config/auth.config");

const Beacon = db.beacon;

exports.addBeacon = (req, res) => {
    Beacon.create({ ...req.body })
        .then(beacon => {
            res.status(200).send({ beacon });
        })
        .catch(err => {
            res.status(500).send({ err: err.message });
        });
};

exports.getBeacons = (req, res) => {
    Beacon.find({})
        .then(beacons => res.status(200).send({ beacons}))
        .catch(err => res.status(500).send({ err: err.message }))
};

exports.updateBeacon = (req, res) => {
    Beacon.updateOne({_id: req.body.id}, req.body.data)
        .then(beacon => {
            res.status(200).send({ beacon })
        })  
        .catch(err => res.status(500).send({ err: err.message }))
}

exports.delBeacon = (req, res) => {
    Beacon.deleteOne({_id: req.body.id})
        .then(beacon => {
            res.status(200).send({ beacon: beacon })
        })  
        .catch(err => res.status(500).send({ err: err.message }))
}