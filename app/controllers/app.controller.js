const db = require("../models");
const config = require("../config/auth.config");
const fs = require('fs')
var bcrypt = require("bcryptjs");

const Beacon = db.beacon;
const V = db.v;
const AuditGroup = db.auditgroup;
const User = db.user;

exports.addBeacon = (req, res) => {

    Beacon.findOne({mac: req.body.mac})
        .then(beacon => {           
          
            if (beacon ==  null) {
                console.log('new device');
                Beacon.create({ ...req.body,groupid: "" })
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
        .then(beacons => {console.log(beacons);res.status(200).send({ beacons}) })
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

exports.checkEditMAC = (req, res) => {
    const mac = req.body.mac;
    const id  = req.body.id;
    console.log("MAC => ", mac + "  && " + req.body.id);
    
    Beacon.findOne({mac: mac})
        .then( beacon => {
            if(beacon == null){
                res.status(200).send({ exist: false });
            } else {
                if(beacon._id != id)
                    res.status(200).send({ exist: true });
                else
                    res.status(200).send({ exist: false });
            } 
        })
        .catch(err => res.status(500).send({ err: err.message }))
}
/******   Audit      *******/
exports.saveAuditGroup =  (req, res) => {
   
    AuditGroup.create({ title: req.body.title, description: '' })
    .then(group_cur => {
        let i = 0;
        
        while (i < req.body.selectedList.length) {   
            Beacon.findOne({_id: req.body.selectedList[i]})
                .then(beacon => {
                    beacon.groupid=group_cur._id.toString();
                    beacon.save().then(()=>{
                        // res.status(200).send({ beacon })
                        console.log("saved successfully");
                    })
                })  
                .catch(err => res.status(500).send({ err: err.message }))
                
                console.log(req.body.selectedList[i]);
                i++;
        }
        res.status(200).send({ group: group_cur , added: true});
    })
    .catch(err => {
        res.status(500).send({ err: err.message });
    });
}
exports.updateAuditGroup = async (req, res) => {
    let new_group = {};
    await AuditGroup.findOne({_id: req.body.groupid})
        .then( group => {            
            group.title = req.body.title;
            group.save().then(() => {
                // Beacon.update({groupid: req.body.groupid}, {$set: {groupid:''} })
                new_group = group;
            })
        })
        .catch(err => res.status(500).send({ err: err.message }))
    await  Beacon.updateMany({groupid: req.body.groupid}, {$set: {groupid:''} })
    let i = 0;        
    while (i < req.body.selectedList.length) {   
        Beacon.findOne({_id: req.body.selectedList[i]})
            .then(beacon => {
                beacon.groupid=req.body.groupid;
                beacon.save().then(()=>{
                    // res.status(200).send({ beacon })
                    console.log("saved successfully");
                })
            })  
            .catch(err => res.status(500).send({ err: err.message }))
            
            console.log(req.body.selectedList[i]);
            i++;
    }
    res.status(200).send({ group: new_group , added: true});
}
exports.getAllAuditGroups = (req, res) => {
    console.log("test");
    AuditGroup.find({})
        .then(groups => res.status(200).send({ groups }))
        .catch(err => res.status(500).send({ err: err.message }))
}
exports.deleteGroup = async (req, res) => {
    console.log(req.body.id);
    let del_group = {}
    await AuditGroup.deleteOne({_id: req.body.id})
            .then(group => {
                del_group = group;
            })  
            .catch(err => res.status(500).send({ err: err.message }))
    await Beacon.updateMany({groupid: req.body.id}, {$set: {groupid:''} });
    res.status(200).send({ group: del_group })
}
exports.getGroupBeacons = (req, res) => {
    Beacon.find({groupid: req.body.groupid})
        .then(beacons => res.status(200).send({beacons}))
        .catch(err => res.status(500).send({err: err.message}));
}
/***     User Management ******/
exports.getUsers = (req, res) => {
    User.find({})
        .then( users => res.status(200).send({users}))
        .catch(err => res.status(500).send({err: err.message}));
}
exports.deleteUser = (req, res) => {
    selectedList = req.body.selectedList;
    console.log(selectedList);
    let i =  0 ; 
    // while( i < selectedList.length){
    //     User.deleteOne({_id: selectedList[i]})
    //         .then(user => {
    //             res.status(200).send({ user: user })
    //         })
    //         .catch(err => res.status(500).send({ err: err.message }));
    //     i++;
    // }
}
exports.checkEmail = (req,res) => {
    console.log(req.body.email);
    User.findOne({ email: req.body.email })
        .then( user => {
            if(user == null){
                res.status(200).send({ user, email: false });
            } else {
                res.status(200).send({ user, email: true });
            }
        }).catch(err => res.status(500).send({ err: err.message }))
}
exports.createUser =  (req, res) => {
    console.log(req.body.email);
    User.findOne({ email: req.body.email })
        .then( user => {
            if(user == null){
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 8),
                    role: 'user'
                })
                .then(user => {
                    res.status(200).send({ user: user , email: false });
                })
                .catch(err => {
                    res.status(500).send({ err: err.message });
                });
            } else {
                res.status(200).send({ user, email: true });
            }
        }).catch(err => res.status(500).send({ err: err.message }))

   
}
exports.updateUser = (req, res) => {
    User.findOne({ _id: req.body.id })
            .then(user => {
                user.name = req.body.name;
                user.email = req.body.email;
                user.role = req.body.role;
                user.password = bcrypt.hashSync(req.body.password, 8);
                user.save().then(()=>{
                    res.status(200).send({ user })
                    console.log("saved successfully");
                })
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