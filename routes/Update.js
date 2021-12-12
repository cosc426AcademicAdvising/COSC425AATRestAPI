/*

Handles any updating of student information

Submits program planning forms from website by updating studnet file

Updates student file based of changes advisor makes through app

*/

const router = require("express").Router();
const { version } = require("joi");
const mongoUtil = require('../mongoUtil');
const verify = require('./token');
var collection;

// Reuqested through submit form in schedule new of website
router.post("/SubmitForm", async (req, res) => {
    // Parse the json string packed into request body
    var tmp = JSON.parse(req.body.form);
    // Get int ID value
    var id = parseInt(tmp['s_id']);
    // Set to Student collection
    collection = mongoUtil.getStud();
    // Start by pulling all courses in 'taking_course' from student file
    await collection.updateOne({
        's_id': id
    },
    {
        '$pull': {
            'taking_course': {
                'subject': {
                    '$exists': true
                }
            }
        }
    }, function(err, obj) {
        if(err) throw err;
        console.log("Updated");
    })
    // Then pull all courses in 'backup_course'
    await collection.updateOne({
        's_id': id
    },
    {
        '$pull': {
            'backup_course': {
                'subject': {
                    '$exists': true
                }
            }
        }
    }, function(err, obj) {
        if(err) throw err;
        console.log("Updated");
    })
    // Set the new memo
    await collection.updateOne({
        's_id': id
    },
    {
        '$set': {
            'memo': tmp.memo
        }
    })
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
        var cred = parseInt(tmp.taking_course[i][2]);
        var gen = tmp.taking_course[i][3];
        // Construct course object
        var crs = {
            'subject': sub,
            'catalog': cat,
            'title': title,
            'cred': cred,
            'genED': gen
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
            result = await collection.updateOne({'s_id': id}, ins, function(err, obj) {
                if(err) throw err;
                console.log("Updated");
            });
        }

    }

    // Repeat process above for 'backup_course'
    var cntB = tmp.backup_course.length;
    obj = [];
    for(var i=0;i<cntB;i++){
        
        var stringArray = tmp.backup_course[i][0].split(/(\s+)/);
        var sub = stringArray[0];
        var cat = stringArray[2];
        var title = tmp.backup_course[i][1];
        var cred = parseInt(tmp.backup_course[i][2]);
        var gen = tmp.backup_course[i][3];
        var crs = {
            'subject': sub,
            'catalog': cat,
            'title': title,
            'cred': cred,
            'genED': gen
        }
        obj.push(crs);
        if(i+1 == cntB){
            var p1 = {}
            p1['backup_course'] = obj;
            var ins = {$set: p1}
            collection.updateOne({'s_id': id}, ins);
        }
    }
    res.json(1);
})

// Reuqested through submit form in schedule new of website
router.post("/SubmitFirstTimeForm", (req, res) => {
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
            // Update database records
            collection.updateOne({'s_id': id}, ins);
        }
    }
    res.json(1);
})

// Updates the courses in a Four Year plan for a specified major
router.post("/MajorPlan", verify.verToken, (req, res) => {
    var plan = req.body;
    cnt = plan.length;
    var maj = plan[0].major
    console.log(plan);
    collection = mongoUtil.getFourYear();
    collection.deleteOne({'major': maj}, function(err, obj) {
        if(err) throw err;
    });

    var newDoc = {
        'name': "",
        'id': "",
        'date': "",
        'major': maj,
        'policies': ""
    }
    collection.insertOne(newDoc);
    
    var obj = [];
    var fullobj = [];
    var field = "";
    var sem = 0;
    var inc = 1;
    // Keeps track of the number of courses in each semester
    var cnter = [0, 0, 0, 0, 0, 0, 0, 0];

    // For the total number of courses
    for(var i=1;i<cnt;i++){
        // Increment the corresponding array value based on which semester the course falls under
        var sem = parseInt(plan[i][0].semester)-1;
        cnter[sem]++;
    }
    // For 8 semesters
    for(var j=0;j<8;j++){
        // For the number of courses in that semester
        for(var i=0;i<cnter[j];i++){
            var sem = parseInt(plan[inc][0].semester);  
            var sub = plan[inc][1].course.subject;
            var cat = plan[inc][1].course.catalog; 
            var title = plan[inc][1].course.title;
            var cred = plan[inc][1].course.credit;
            // Construct course object
            var crs = { 
                'subject': sub,
                'catalog': cat,
                'title': title,
                'cred': cred
            }
            // Push object into array
            obj.push(crs)
            inc++;
        }
        // Construct field name
        field = 'semester_' + sem;
        var tmp = {}
        // Method to assign a field name based of value in variable
        tmp[field] = obj;
        var ins = {$set: tmp}
        // Update database records
        collection.updateOne({"major": maj}, ins, (error, result) => {
            if(error) console.log(error);
            
        });
        // Clear array
        obj=[];
    }
    
    res.json(1);
})

// Updates the courses in a Four Year plan for a specified major
router.post("/MinorPlan", verify.verToken, (req, res) => {
    var plan = req.body;
    console.log(plan[0]);
    
    var minor = plan[0][0].minor;
    var grp = plan[0][0].group;
    var req = plan[0][0].req;
    
    console.log(minor);
    console.log(grp);
    collection = mongoUtil.getMinPlan();
    var obj = [];
    var cnt = plan.length;
    for(var i=1;i<cnt;i++) {
        var sub = plan[i].course.subject;
        var cat = plan[i].course.catalog; 
        var title = plan[i].course.title;
        var cred = plan[i].course.credit;
        // Construct course object
        var crs = { 
            'subject': sub,
            'catalog': cat,
            'title': title,
            'cred': cred
        };
        // Push object into array
        obj.push(crs);
    }
    field = 'crs' + String(grp);
    field2 = 'req' + String(grp);
    tmp = {}
    tmp[field] = {'subject': {'$exists': true}};
    // Pull previous courses
    collection.updateOne({
        'minor': minor
    },
    {
        '$pull': tmp
    }, function(err, obj) {
        if(err) throw err;
        console.log("Updated");
    })
    // Construct field name
    
    var tmp = {};
    var tmp2 = {};
    // Method to assign a field name based of value in variable
    tmp[field] = obj;
    tmp2[field2] = req;
    var ins = {$set: tmp};
    // Update database records
    collection.updateOne({"minor": minor}, ins, (error, result) => {
        if(error) console.log(error);
    });
    var ins2 = {$set: tmp2};
    // Update database records
    collection.updateOne({"minor": minor}, ins2, (error, result) => {
        if(error) console.log(error);
    });
    
    res.json(1);
})


// set majors to new values
router.post("/Enrll", verify.verToken, (req, res) => {
    var date = req.body.enrll;
    var sid = parseInt(req.body.s_id);
    var newVal = { $set: {'enrll': date}};
    collection = mongoUtil.getStud();
    collection.updateOne({"s_id": sid}, newVal,
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

// set majors to new values
router.post("/MajorSet", verify.verToken, (req, res) => {
    var quer = req.body.query;
    var sid = parseInt(req.body.s_id);
    var maj = req.body.maj;
    var param = {};
    param[quer] = maj;
    var newVal = { $set: param};
    collection = mongoUtil.getStud();
    collection.updateOne({"s_id": sid}, newVal,
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

// pull outdated majors
// Whenever new major count is less than previous
router.post("/MajorPull", verify.verToken, (req, res) => {
    var sid = parseInt(req.body.s_id);
    var newVal = { $pull: {'major': {'title': 'null'}}};
    collection = mongoUtil.getStud();
    collection.updateOne({"s_id": sid}, newVal,
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
        
    });
});


// set minors to updated values
router.post("/MinorSet", verify.verToken, (req, res) => {
    var quer = req.body.query;
    var sid = parseInt(req.body.s_id);
    var min = req.body.min;
    var param = {};
    param[quer] = min;
    var newVal = { $set: param};
    console.log(sid, min, quer)
    collection = mongoUtil.getStud();
    collection.updateOne({"s_id": sid}, newVal,
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        console.log(result);
        res.send(result);
    });
});

// pull outdated minors
// Whenever new major count is less than previous
router.post("/MinorPull", verify.verToken, (req, res) => {
    var sid = parseInt(req.body.s_id);
    var newVal = { $pull: {'minor': {'title': 'null'}}};
    console.log(sid)
    collection = mongoUtil.getStud();
    collection.updateOne({"s_id": sid}, newVal,
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
        
    });
});

// set courses to updated values
router.post("/CourseSet", verify.verToken, (req, res) => {
    var q1 = req.body.field1;
    var q2 = req.body.field2;
    var q3 = req.body.field3;
    var q4 = req.body.field4;
    var q5 = req.body.field5;
    var sub = req.body.sub;
    var cat = req.body.cat;
    var cred = req.body.cred;
    var title = req.body.title;
    var gen = req.body.gen;
    var sid = parseInt(req.body.s_id);
    var p1 = {};
    var p2 = {};
    var p3 = {};
    var p4 = {};
    var p5 = {};
    
    p1[q1] = sub;
    p2[q2] = cat;
    p3[q3] = title;
    p4[q4] = cred;
    p5[q5] = gen;
    for(var i=0;i<5;i++){
        var newVal = { };
        if(i == 0)
            newVal = { $set: p1};
        if(i == 1)
            newVal = { $set: p2};
        if(i == 2)
            newVal = { $set: p3};
        if(i == 3)
            newVal = { $set: p4};
        if(i == 4)
            newVal = { $set: p5};
        collection = mongoUtil.getStud();
        collection.updateOne({"s_id": sid}, newVal, (error, result) => {
            if(error) {
                return res.status(500).send(error);
            }
        });
    }
    res.json(1);
});

// Reset old courses to null values
// Sets no longer needed courses to NULL indicating need for removal
router.post("/CourseReset", verify.verToken, (req, res) => {
    var q1 = req.body.field1;
    var sid = parseInt(req.body.s_id);
    var p1 = {};
    p1[q1] = 'null';
    var newVal = { $set: p1};
    collection = mongoUtil.getStud();
    collection.updateOne({"s_id": sid}, newVal,
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        console.log(result);
        res.send(result);
    });
});

// pull outdated courses
// Whenever count of taking_courses is less than previous
router.post("/CoursePull", verify.verToken, (req, res) => {
    var sid = parseInt(req.body.s_id);
    var newVal = { $pull: {'taking_course': {'subject': 'null'}}};
    collection = mongoUtil.getStud();
    collection.updateOne({"s_id": sid}, newVal,
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

// pull outdated backup courses
// Whenever count of backup_courses is less than previous
router.post("/BackCoursePull", verify.verToken, (req, res) => {
    var sid = parseInt(req.body.s_id);
    var newVal = { $pull: {'backup_course': {'subject': 'null'}}};
    collection = mongoUtil.getStud();
    collection.updateOne({"s_id": sid}, newVal,
    (error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
        
    });
});

router.post("/NewPass", (req, res) =>{
		const bodyParser = require('body-parser');
		const express = require('express');
		express().use(bodyParser());
		var sid = req.body['s_id'];
		var hash = req.body['passHash'];
		const update = {
			$set: {
				passHash: hash
			},
		};
		collection = mongoUtil.getStud();
		collection.updateOne({"s_id": sid}, update,
		(error, result) => {
			if(error){
				return res.status(500).send(error);
			}
			res.send(result);
		});
});
	
module.exports = router;
