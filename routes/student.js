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


router.get("/hashpass/:id", (req, res) => {
    collection = mongoUtil.getApiAccess();
    // MongoDB aggregation which groups unique s_id and name then projects those values
    var s_id = parseInt(req.params.id);
    collection.findOne({'s_id': s_id}, (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});


//posts new student
router.post("/new/:id", (req, res) => {
    
    var sid = parseInt(req.params.id);
    var name = req.body.name;
    var hash = req.body.passHash;
    var maj = req.body.major;
    var min = req.body.minor;
    var maj_cnt = maj.length;
    var min_cnt = min.length;
    var major = [];
    var minor = [];
    for(var i=0;i<maj_cnt;i++)
        major.push({'title': maj[i]})
    for(var i=0;i<min_cnt;i++)
        minor.push({'title': min[i]})

    var ctaken = [];
    var taking = [];
    var backup = [];

    collection = mongoUtil.getApiAccess();
    var user = {
        's_id': sid,
        'password': hash
    }
    collection.insertOne(user);

    collection = mongoUtil.getStud();
    var stud = {
      'name': name,
      's_id': sid,
      'major': major,
      'minor': minor,
      'status': "",
      'year': "",
      'credits': 0,
      'sem_id': "",
      'registering_for': "",
      'enrll': "",
      'course_taken': ctaken,
      'taking_course': taking,
      'backup_course': backup,
      'semester': "",
      'memo': ""
    }
    result = collection.insertOne(stud);
    res.send(result);
});

//posts new student sign up info
router.post("/firstTime", async (req, res) => {
    // Parse the json string packed into request body
    var tmp = JSON.parse(req.body.form);
    console.log(tmp);
    // Get int ID value
    var id = parseInt(tmp['s_id']);
    // Set to Student collection
    collection = mongoUtil.getStud();
    // Get number of couses attempting to be added
    var cntT = tmp.taking_course.length;
    var s1 = [];
    var s2 = [];
    var s3 = [];
    var s4 = [];
    var s5 = [];
    var s6 = [];
    var s7 = [];
    var s8 = [];
    // For each course in 'taking_course'
    for(var i=0;i<cntT;i++){
        // Split the subject and catalog
        var stringArray = tmp.taking_course[i][0].split(/(\s+)/);
        // Assign body values to variables
        var sub = stringArray[0];
        var cat = stringArray[2];
        var title = tmp.taking_course[i][1];
        var cred = tmp.taking_course[i][2];
        var sem = tmp.taking_course[i][3];
        // Construct course object
        var crs = {
            'subject': sub,
            'catalog': cat,
            'title': title,
            'credits': cred,
            'grade': "P"
        }
        switch (sem){
            case '1':
                s1.push(crs);
                break;
            case '2':
                s2.push(crs);
                break;
            case '3':
                s3.push(crs);
                break;
            case '4':
                s4.push(crs);
                break;
            case '5':
                s5.push(crs);
                break;
            case '6':
                s6.push(crs);
                break;
            case '7':
                s7.push(crs);
                break;
            case '8':
                s8.push(crs);
                break;
        }        
    }
    p2 = [{
        'semester_1': s1,
        'semester_2': s2,
        'semester_3': s3,
        'semester_4': s4,
        'semester_5': s5,
        'semester_6': s6,
        'semester_7': s7,
        'semester_8': s8
    }]
    p1 = {'course_taken': p2};

    var ins = {$set: p1}
    result = await collection.updateOne({'s_id': id}, ins);
    console.log(result);
    res.send(result);
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
