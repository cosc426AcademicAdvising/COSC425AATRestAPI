/*

Department Collection database functions
Returns or posts any data to Department collection in database

Some comments above function name correspond with the function name of
 the python app that is requesting this 

 Majority of functions that pull data from database have
 a similar structure with the query methods changing

*/
const router = require("express").Router();
const mongoUtil = require('../mongoUtil');
const verify = require('./token');
var collection;


//Find course by regex
//Returns all courses that match the specified parameters
router.post("/Regex", verify.verToken, (req, res) => {
    collection = mongoUtil.getDept();
    // Pull posted variables from the requests body
    var plan = req.body.plan;
    var type = req.body.type;
    var prog = req.body.prog;
    var schl = req.body.schl;
    // Find matching values and project the 'Acad Plan' (Subject), 'Plan Type' (Catalog), 'Acad Prog' (Course Title), and 'School' 
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
        // Use a return of 0 to indicate that no courses were found
        if(result == null)
            res.json(0);
        else
            res.send(result);
    });
});

// AAT name
// getDistinctSchools
// Returns a list of all distinct school names within all majors
router.get("/MajorSchool", verify.verToken, (req, res) => {
    collection = mongoUtil.getDept();
    collection.distinct("School", {'Plan Type': 'Major'}, function(error, result){
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

// AAT name
// getDistinctSchools
// Returns a list of all distinct school names within all minors
router.get("/MinorSchool",  verify.verToken, (req, res) => {
    collection = mongoUtil.getDept();
    collection.distinct("School", {'Plan Type': 'Minor'}, function(error, result){
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});


// AAT function name
// getMajors
// Returns a lsit of all majors
router.get("/Major", (req, res) => {
    collection = mongoUtil.getDept();
    collection.find({'Plan Type': 'Major'}).project({'Acad Plan': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

//getMajorsbySchool
// Returns a list of all majors unders a specified school
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
//Returns true/false for whether a major is in the database
router.get("/MajorIn/:check",  verify.verToken, (req, res) => {
    collection = mongoUtil.getDept();
    var name = req.params.check;
    collection.find({'Plan Type': 'Major', 'Acad Plan': name}).project({'Acad Plan': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        if(result == null)
            res.json(0);
        else
            res.json(1);
    });
});

// AAT function name
//addMajor
// Adds a new major to the database
router.post("/Major/Add",  verify.verToken, async (req, res) => {
    collection = mongoUtil.getDept();
    var maj = req.body;
    // Construct a new major object with given data
    const post = {
        'Acad Plan': maj.Acad_Plan, 'Plan Type': maj.Plan_Type, 
        'Acad Prog': maj.Acad_Prog, 'School': maj.School, 'School Full Name': maj.School_Full_Name
    };
    // Try to insert the object and catch error
    try {
        const result = await collection.insertOne(post);
        res.json(1);
    } catch (err) {
        res.json({ message: err});
    }
});

// AAT function name
//deleteMajor
// Removes a major from the database
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

// AAT function name
// getMinors
// Returns a list of all minors
router.get("/Minor", (req, res) => {
    collection = mongoUtil.getMinPlan();
    collection.find().project({'minor': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

// AAT function name
//getMinorsbySchool
// Returns a list of all minors under a specified school
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
// Returns true/false for whether a minor exists in database
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

// AAT function name
//addMinor
// Adds a new minor to the database
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
// Removes a minor from the database
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

// AAT function name
// getMajorPlan
// Returns a four year plan for the specified major
router.get("/MajorPlans", verify.verToken, (req, res) => {
    collection = mongoUtil.getFourYear();
    collection.find().project({'major': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

// AAT function name
// getMinorPlan
// Returns a four year plan for the specified minor
router.get("/MinorPlans", verify.verToken, (req, res) => {
    collection = mongoUtil.getMinPlan();
    collection.find().project({'minor': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

module.exports = router;
