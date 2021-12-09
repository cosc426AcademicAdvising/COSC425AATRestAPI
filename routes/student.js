/*

Student Collection database functions
Returns or posts any data to Student collection in database

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
// getStudentbyID
// Returns a student doc based of specified ID value
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

// AAT function name
// getDistinctStudentIDs
// Returns a list of all distinct student IDs
router.get("/all/id",  verify.verToken, (req, res) => {
    collection = mongoUtil.getStud();
    collection.distinct("s_id", {}, function(error, result){
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

// AAT function name
// getAllStudents
// Returns a list of all Student names and ID's
router.get("/all/students", verify.verToken, (req, res) => {
    collection = mongoUtil.getStud();
    // MongoDB aggregation which groups unique s_id and name then projects those values
    
    collection.find().project({'name': 1,'s_id': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

// AAT function name
// getAllStudentsIds
// Returns a list of all Student ID's
router.get("/all/studentsIds", verify.verToken, (req, res) => {
    collection = mongoUtil.getStud();
    // MongoDB aggregation which groups unique s_id and name then projects those values
    
    collection.find().project({'s_id': 1, _id:0}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

//posts new student
router.post("/new/:id", (req, res) => {
    collection = mongoUtil.getStud();
    var sid = parseInt(req.params.id);
    var name = req.body.name;
    var hash = req.body.passHash;
    var maj = [];
    var min = [];
    var ctaken = [];
    var taking = [];
    var backup = [];
    var stud = {
      'name': name,
      's_id': sid,
      'major': maj,
      'minor': min,
      'status': "",
      'year': "",
      'credits': 0,
      'sem_id': "",
      'registering_for': "",
      'enrll': "",
      'course_taken': ctaken,
      'taking_course': taking,
      'backup_course': backup,
      'passHash': hash,
      'semester': ""
    }
    collection.insertOne(stud);
});


//posts new student sign up info
router.post("/firstTime",  (req, res) => {
    // Parse the json string packed into request body
    var tmp = JSON.parse(req.body.form);
    // Get int ID value
    var id = parseInt(tmp['s_id']);
    // Set to Student collection
    collection = mongoUtil.getStud();
    // Get number of couses attempting to be added
    var cntT = tmp.taking_course.length;
    var obj = []
    // For each course in 'taking_course'
    for(var i=0;i<cntT;i++){
        // Split the subject and catalog
        var stringArray = tmp.taking_course[i][0].split(/(\s+)/);
        // Assign body values to variables
        var sub = stringArray[0];
        var cat = stringArray[2];
        var title = tmp.taking_course[i][1];
        var cred = tmp.taking_course[i][2];
        // Construct course object
        var crs = {
            'subject': sub,
            'catalog': cat,
            'title': title,
            'cred': cred
        }
        // Add course to array
        obj.push(crs);
        // If on the last course then update the doc
        if(i+1 == cntT){
            // Assign the field name for the array of objects
            var p1 = {}
            p1['taking_course'] = obj;
            var ins = {$set: p1}
            console.log(ins);
            // Update database records
            // collection.updateOne({'s_id': id}, ins);
        }
    }
    res.json(1);
});

// AAT function name
//delStud
// Removes a minor from the database
// router.post("/Minor/Delete/:student/:id",  verify.verToken, async (req, res) => {
//     collection = mongoUtil.getStud();
//     var stud = req.params.student;
//     var id = parseInt(req.params.id);
//     try {
//         const result = await collection.deleteOne({'name': stud, 's_id': id});
//         res.json(1);
//     } catch (err) {
//         res.json({ message: err});
//     }
// });

module.exports = router;
