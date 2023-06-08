const db = require("../models");
const config = require("../config/auth.config");
const fs = require('fs')

const Beacon = db.beacon;
const V = db.v;

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
    console.log(req.body.data)
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

/** This is for analyzing services and characterics... */
exports.v = async (req, res) => {
    try{
        const [device, data] = req.body.data;
        let log = await V.findOne({device: device})
        if(log){
            log.data = JSON.stringify(req.data);
            await log.save();
        }else{
            log = await V.create({device, data })
        }
        res.send(log)
    }
    catch(err) {
        console.log(err);
    }
        
}