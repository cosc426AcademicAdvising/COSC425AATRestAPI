const router = require("express").Router();
const mongoUtil = require('../mongoUtil');
const verify = require('./token');

var collection;

// getFourYearPoliciesbyMajor
router.get("/Plan/:minor", verify.verToken, (req, res) => {
    collection = mongoUtil.getMinPlan();
    var min = req.params.minor;
    collection.findOne({"minor": min},
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

module.exports = router;