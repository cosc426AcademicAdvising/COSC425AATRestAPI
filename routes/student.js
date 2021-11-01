const router = require("express").Router();
const mongoUtil = require('../mongoUtil');
const verify = require('./token');

var collection;

// getStudentbyID
router.get("/:id", verify.verToken, (req, res) => {
    collection = mongoUtil.getStud();
    var sid = parseInt(req.params.id);
    collection.findOne({"s_id": sid},
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

// getDistinctStudentIDs
router.get("/all/id",  verify.verToken, (req, res) => {
    collection = mongoUtil.getStud();
    collection.distinct("s_id", {}, function(error, result){
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

// getAllStudents
router.get("/all/students",  verify.verToken, (req, res) => {
    collection = mongoUtil.getStud();
    collection.aggregate([
            {
                "$group": {
                        "s_id": "$s_id",
                        "name": "$name"
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "s_id": "$s_id",
                    "name": "$name"
                }
            }
        ], function(error, result){
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

//posts new student
router.post("/new/:id", verify.verToken, (req, res) => {
    collection = mongoUtil.getStud();
    var sid = parseInt(req.params.id);
	var name = req.body.name;
	var passHash = req.body.passHash;
	var enrll = req.body.enrll;
	var stud = {};
	stud[name] = name;
	stud[passHash] = passHash;
	stud[enrll] = enrll;
	var newVal = { $set: stud};
    collection.insertOne({"s_id": sid}, newVal,
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

module.exports = router;
