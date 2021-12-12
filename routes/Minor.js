/*

Minor Collection database functions
Returns or posts any data to Minor collection in database

Some comments above function name correspond with the function name of
 the python app that is requesting this 

 Majority of functions that pull data from database have
 a similar structure with the query methods changing

*/
const router = require("express").Router();
const mongoUtil = require('../mongoUtil');
const verify = require('./token');

var collection;

// AAT function name
// getFourYearPoliciesbyMajor
// Returns the policies in minor plan for a speciifed minor
router.get("/Plan/:minor", verify.verToken, (req, res) => {
    collection = mongoUtil.getMinPlan();
    var min = req.params.minor;
    collection.findOne({"minor": min},
    (error, result) => {
        if(error) {
            return res.json(1)
        }
        res.send(result);
    });
});

module.exports = router;