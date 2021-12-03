const router = require("express").Router();
const mongoUtil = require('../mongoUtil');
const verify = require('./token');
var collection;

//Inserts a draft of program planning form from website into database
router.post("/Submit", (req, res) => {
    collection = mongoUtil.getDraft();
    // Pull posted variables from the requests body
    var tmp = JSON.parse(req.body.form);
    var id = parseInt(tmp['s_id']);
    
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
            // Update database records
            // collection.updateOne({'s_id': id}, ins);
        }
    }
    
    // Repeat process above for 'backup_course'
    var cntB = tmp.backup_course.length;
    obj2 = [];
    for(var i=0;i<cntB;i++){
        
        var stringArray = tmp.backup_course[i][0].split(/(\s+)/);
        var sub = stringArray[0];
        var cat = stringArray[2];
        var title = tmp.backup_course[i][1];
        var cred = tmp.backup_course[i][2];
        var crs = {
            'subject': sub,
            'catalog': cat,
            'title': title,
            'cred': cred
        }
        obj2.push(crs);
        if(i+1 == cntB){
            var p1 = {}
            p1['backup_course'] = obj2;
            var ins = {$set: p1}
            collection.updateOne({'s_id': id}, ins);
        }
    }
    var newDoc = {
        's_id': id,
        'taking_course': obj,
        'backup_course': obj2
    }
    collection.insertOne(newDoc);
    res.json(1);
});

// Returns a program planning draft for a given student ID
router.get("/getDraft/:id",  (req, res) => {
    collection = mongoUtil.getDraft();
    id = parseInt(req.params.id);
    collection.findOne({"s_id": id},
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

router.get("/draftExists/:id",  (req, res) => {
    collection = mongoUtil.getDraft();
    id = parseInt(req.params.id);
    collection.findOne({"s_id": id},
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        console.log(result);
        if(result == null)
            res.json(0);
        else
            res.json(1);
    });
});

// Removes a program planning draft for a given student ID
router.get("/Delete/:id",  (req, res) => {
    collection = mongoUtil.getDraft();
    id = parseInt(req.params.id);
    collection.deleteOne({"s_id": id},
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});
module.exports = router;