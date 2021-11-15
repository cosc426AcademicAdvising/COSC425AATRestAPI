const router = require("express").Router();
const mongoUtil = require('../mongoUtil');
const verify = require('./token');
var collection;


//Find course regex
router.post("/Regex", verify.verToken, (req, res) => {
    collection = mongoUtil.getDept();
    var plan = req.body.plan;
    var type = req.body.type;
    var prog = req.body.prog;
    var schl = req.body.schl;
    collection.find({
            "$and": [
                { 'Acad Plan': { '$regex': plan} },
                { 'Plan Type': { '$regex': type} },
                { 'Acad Prog': { '$regex': prog} },
                { 'School': { '$regex': schl} }
            ]})
            .project({'Acad Plan': 1, 'Plan Type': 1, 'Acad Prog': 1, 'School': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        if(result == "")
            res.json(0);
        else
            res.send(result);
    });
});

// getDistinctSchools
router.get("/MajorSchool", verify.verToken, (req, res) => {
    collection = mongoUtil.getDept();
    collection.distinct("School", {'Plan Type': 'Major'}, function(error, result){
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

// getDistinctSchools
router.get("/MinorSchool",  verify.verToken, (req, res) => {
    collection = mongoUtil.getDept();
    collection.distinct("School", {'Plan Type': 'Minor'}, function(error, result){
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

// getMajors
router.get("/Major", verify.verToken, (req, res) => {
    collection = mongoUtil.getDept();
    collection.find({'Plan Type': 'Major'}).project({'Acad Plan': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

//getMajorsbySchool
router.get("/Major/:school", verify.verToken, (req, res) => {
    collection = mongoUtil.getDept();
    var name = req.params.school;
    collection.find({'Plan Type': 'Major', 'School': name}).project({'Acad Plan': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

//Check if Major exists
router.get("/MajorIn/:check",  verify.verToken, (req, res) => {
    collection = mongoUtil.getDept();
    var name = req.params.check;
    collection.find({'Plan Type': 'Major', 'Acad Plan': name}).project({'Acad Plan': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        if(result == "")
            res.json(0);
        else
            res.json(1);
    });
});


//addMajor
router.post("/Major/Add",  verify.verToken, async (req, res) => {
    collection = mongoUtil.getDept();
    var maj = req.body;
    const post = {
        'Acad Plan': maj.Acad_Plan, 'Plan Type': maj.Plan_Type, 
        'Acad Prog': maj.Acad_Prog, 'School': maj.School, 'School Full Name': maj.School_Full_Name
    };
    try {
        const result = await collection.insertOne(post);
        res.json(1);
    } catch (err) {
        res.json({ message: err});
    }
});

//deleteMajor
router.post("/Major/Delete/:major", verify.verToken, async (req, res) => {
    collection = mongoUtil.getDept();
    var maj = req.params.major;
    try {
        const result = await collection.deleteOne({'Plan Type': 'Major', 'Acad Plan': maj});
        res.json(1);
    } catch (err) {
        res.json({ message: err});
    }
});

// getMinors
router.get("/Minor", verify.verToken, (req, res) => {
    collection = mongoUtil.getDept();
    collection.find({'Plan Type': 'Minor'}).project({'Acad Plan': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

//getMinorsbySchool
router.get("/Minor/:school", verify.verToken, (req, res) => {
    collection = mongoUtil.getDept();
    var name = req.params.school;
    collection.find({'Plan Type': 'Minor', 'School': name}).project({'Acad Plan': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

//Check if Minor exists
router.get("/MinorIn/:check",  verify.verToken, (req, res) => {
    collection = mongoUtil.getDept();
    var name = req.params.check;
    collection.find({'Plan Type': 'Minor', 'Acad Plan': name}).project({'Acad Plan': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        if(result == "")
            res.json(0);
        else
            res.json(1);
    });
});

//addMinor
router.post("/Minor/Add",  verify.verToken, async (req, res) => {
    collection = mongoUtil.getDept();
    var min = req.body;
    const post = {
        'Acad Plan': min.Acad_Plan, 'Plan Type': min.Plan_Type, 
        'Acad Prog': min.Acad_Prog, 'School': min.School, 'School Full Name': min.School_Full_Name
    };
    try {
        const result = await collection.insertOne(post);
        res.json(1);
    } catch (err) {
        res.json({ message: err});
    }
});

//deleteMinor
router.post("/Minor/Delete/:minor",  verify.verToken, async (req, res) => {
    collection = mongoUtil.getDept();
    var min = req.params.minor;
    try {
        const result = await collection.deleteOne({'Plan Type': 'Major', 'Acad Plan': min});
        res.json(1);
    } catch (err) {
        res.json({ message: err});
    }
});

// getMajorPlan
router.get("/MajorPlans", verify.verToken, (req, res) => {
    collection = mongoUtil.getFourYear();
    collection.find().project({'major': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

module.exports = router;