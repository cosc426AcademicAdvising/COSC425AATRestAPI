const router = require("express").Router();
const mongoUtil = require('../mongoUtil');
const verify = require('./token');
var collection;

// getDistinctSubjects
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
router.post("/Regex", verify.verToken, (req, res) => {
    collection = mongoUtil.getCourse();
    var sub = req.body.subject;
    var cat = req.body.catalog;
    var title = req.body.title;
    var cred = req.body.credit;
    console.log(sub);
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

// getCoursebySubCat
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

module.exports = router;