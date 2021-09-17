const router = require("express").Router();
const mongoUtil = require('../mongoUtil');
const verify = require('./token');
var collection;

// set majors to updated values
router.post("/MajorSet", verify.verToken, (req, res) => {
    var quer = req.params.query;
    var sid = req.params.s_id;
    var maj = req.params.maj;
    var newVal = { $set: {quer : maj}};
    console.log(sid, maj, quer)
    collection = mongoUtil.getStud();
    collection.updateOne({"s_id": sid}, newVal,
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
        
    });
});

// pull outdated majors
router.post("/MajorPull", verify.verToken, (req, res) => {
    var sid = req.params.s_id;
    var newVal = { $pull: {'major': {'title': 'null'}}};
    console.log(sid)
    collection = mongoUtil.getStud();
    collection.updateOne({"s_id": sid}, newVal,
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
        
    });
});

module.exports = router;