/*

Four Year Collection database functions
Returns or posts any data to Four Year collection in database

Some comments above function name correspond with the function name of
 a different app that is requesting this 

 Majority of functions that pull data from database have
 a similar structure with the query methods changing

*/

const router = require("express").Router();
const mongoUtil = require('../mongoUtil');
const verify = require('./token');

var collection;

// AAT function name
// getFourYearPoliciesbyMajor
// '/:major' indicates the request will pack a paramter (name of major) in the end URL string
router.get("/Policy/:major", verify.verToken, (req, res) => {
    // Get four year collection
    collection = mongoUtil.getFourYear();
    // Get major from request paramaters
    var maj = req.params.major;
    // Find matching major in database and project the policies
    collection.find({"major": maj}).project({'policies': 1, _id: 0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});


// Check if Four Year Plan exists by exact match
router.get("/FourYearIn/:check",  verify.verToken, (req, res) => {
    collection = mongoUtil.getFourYear();
    var name = req.params.check;
    collection.find({'major': name}).project({'major': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        if(result == "")
            res.json(0);
        else
            res.json(1);
    });
});


//Check if Four Year Plan exists by regex match
router.get("/FourYearInRegex/:check",  verify.verToken, (req, res) => {
    collection = mongoUtil.getFourYear();
    var name = req.params.check;
    collection.find({"major": {"$regex": name}}).project({'major': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        if(result == "")
            res.json(0);
        else
            res.json(1);
    });
});

// AAT Function name
// getFourYearbyMajor
// Returns four year plan by major specified
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

// AAT function name
// getFourYearbyMajor
// Returns four year plan found through regex search
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