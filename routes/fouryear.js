const router = require("express").Router();
const mongoUtil = require('../mongoUtil');
const verify = require('./token');

var collection;

// getFourYearPoliciesbyMajor
router.get("/Policy/:major", verify.verToken, (req, res) => {
    collection = mongoUtil.getFourYear();
    var maj = req.params.major;
    collection.find({"major": maj}).project({'policies': 1, _id: 0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});


//Check if Four Year Plan exists
router.get("/FourYearIn/:check", (req, res) => {
    collection = mongoUtil.getFourYear();
    var name = req.params.check;
    collection.findOne({'major': name}).project({'major': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        if(result == "")
            res.json(0);
        else
            res.json(1);
    });
});

//Check if Four Year Plan (Regex Search) exists
router.get("/FourYearInRegex/:check", (req, res) => {
    collection = mongoUtil.getFourYear();
    var name = req.params.check;
    collection.findOne({"major": {"$regex": maj}}).project({'major': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        if(result == "")
            res.json(0);
        else
            res.json(1);
    });
});

// getFourYearbyMajor
router.get("/MajorPlan/:major", verify.verToken, (req, res) => {
    collection = mongoUtil.getFourYear();
    var maj = req.params.major;
    collection.findOne({"major": maj},
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

// getFourYearbyMajor
router.get("/MajorPlan/Regex/:major", verify.verToken, (req, res) => {
    collection = mongoUtil.getFourYear();
    var maj = req.params.major;
    collection.findOne({"major": {"$regex": maj}},
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});



module.exports = router;