const db = require("../models");
const config = require("../config/auth.config");
const fs = require('fs')

const Beacon = db.beacon;
const V = db.v;

exports.addBeacon = (req, res) => {

    Beacon.findOne({mac: req.body.mac})
        .then(beacon => {           
          
            if (beacon ==  null) {
                console.log('new device');
                Beacon.create({ ...req.body })
                    .then(beacon => {
                        res.status(200).send({ beacon , added: true});
                    })
                    .catch(err => {
                        res.status(500).send({ err: err.message });
                    });
            } else {
                res.status(200).send({beacon, added: false});
                // res.status(500).send({ err: "The same device already exists!" });
                // const {name, location, address, mac, description} = req.body.data;
                console.log("The same device already exists!", req.body.name);
                // Beacon.updateOne({_id: beacon.id}, {name: req.body.name, location: req.body.location, address: req.body.address, 
                //          description: req.body.description},
                //     function (err, docs) {
                //         if (err){
                //             console.log(err)
                //         } else {
                //             console.log("Updated Docs : ", docs);
                //             // res.status(200).send({docs});
                //         }
                //     });

                // beacon.name=req.body.name;
                // beacon.location=req.body.location;
                // beacon.address=req.body.address;
                // beacon.description=req.body.description;
                // beacon.save().then(()=>{
                //     console.log("saved");
                //      res.status(200).send({beacon, added: false});
                // })
            }
        })  
        .catch(err => res.status(500).send({ err: err.message }))    
        
    

};

exports.getBeacons = (req, res) => {
    Beacon.find({})
        .then(beacons => res.status(200).send({ beacons}))
        .catch(err => res.status(500).send({ err: err.message }))
};

exports.updateBeacon = (req, res) => {
    Beacon.findOne({_id: req.body.id})
        .then(beacon => {
            const {name, location, address, mac, description} = req.body.data;
            beacon.name=name;
            beacon.location=location;
            beacon.address=address;
            beacon.mac=mac;
            beacon.description=description;
            beacon.save().then(()=>{
                res.status(200).send({ beacon })
            })
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

exports.checkMAC = (req, res) => {
    const mac = req.body.mac;
    console.log("MAC => ", mac);
    Beacon.findOne({mac: mac})
        .then( beacon => {
            if(beacon == null){
                res.status(200).send({ exist: false });
            } else {
                res.status(200).send({ exist: true });
            }
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