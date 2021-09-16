const router = require("express").Router();
const mongoUtil = require('../mongoUtil');
const verify = require('./token');
var collection;

// getDistinctSchools
router.post("/MajorSet", verify.verToken, (req, res) => {
    var query = req.params.query;
    var sid = req.params.s_id;
    var maj = req.params.maj;
    var newVal = { $set: {query: maj}};
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