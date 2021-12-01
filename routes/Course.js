/*

Course Collection database functions
Returns or posts any data to Course collection in database

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
// getDistinctSubjects
// Returns a list of all distinct subjects for all courses
router.get("/Subject", verify.verToken, (req, res) => {
    {
        collection = mongoUtil.getCourse();
        collection.distinct("Subject", function(error, result){
            if(error) {
                return res.status(500).send(error);
            }
            res.send(result);
        });
    }
});

//Find course regex
// Returns a list of all courses matching specified paramters
router.post("/Regex", verify.verToken, (req, res) => {
    collection = mongoUtil.getCourse();
    var sub = req.body.subject;
    var cat = req.body.catalog;
    var title = req.body.title;
    var cred = req.body.credit;
    collection.find({
            "$and": [
                { 'Subject': { '$regex': sub} },
                { 'Catalog': { '$regex': cat} },
                { 'Long Title': { '$regex': title} },
                { 'Allowd Unt': { '$regex': cred} },
                { 'Status': 'A' }
            ]})
            .project({'Subject': 1, 'Catalog': 1, 'Allowd Unt': 1, 'Long Title': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        if(result == "")
            res.json(0);
        else
            res.send(result);
    });
});

// AAT function name
// getCoursebySubCat
// Returns a course matching a specified subject and catalog
router.get("/:subject/:catalog", verify.verToken, (req, res) => {
    collection = mongoUtil.getCourse();
    var sub = req.params.subject;
    var cat = req.params.catalog;
    spacer = " ";
    cat = spacer + cat;
    collection.find({'Status': 'A', 'Subject': sub, 'Catalog': cat}).project({
        'Subject': 1, 'Catalog': 1, 'Long Title': 1, 'Allowd Unt': 1,_id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

// AAT function name
// insertCSV
// Update database course list by inserting csv file from python app
router.post("/insertCSV", verify.verToken, (req, res) => {
    collection = mongoUtil.getTest();
    collection.drop(function(err, delOK) {
        if (err) throw err;
        if (delOK) console.log("Collection deleted");
        db.close();
      })
    var db = mongoUtil.getDb();
    db.createCollection("test", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
    collection = mongoUtil.getTest();
    var obj = req.body.finalOut;
    console.log(obj);
    // collection.insertMany(obj, function(error, result){
    //     if(error) {
    //         return res.status(500).send(error);
    //     }
    //     res.send(result);
    // });
    res.json(1);
});

module.exports = router;