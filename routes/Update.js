const router = require("express").Router();
const { version } = require("joi");
const mongoUtil = require('../mongoUtil');
const verify = require('./token');
var collection;

router.post("/SubmitForm", (req, res) => {
    var tmp = req.body;
    console.log(tmp);
    console.log("hi")
    res.send("a");
})

router.post("/MajorPlan", (req, res) => {
    var plan = req.body;
    cnt = plan.length;
    var maj = plan[0].major
    // console.log(maj);
    // console.log(plan[1][0].semester)
    // console.log(plan[1][1].course)
    // console.log(plan[1][1].course.subject)
    
    collection = mongoUtil.getFourYear();
    collection.deleteOne({'major': maj}, function(err, obj) {
        if(err) throw err;
        console.log('1 doc deleted');
    });

    var newDoc = {
        'name': "",
        'id': "",
        'date': "",
        'major': maj,
        'policies': ""
    }
    collection.insertOne(newDoc);
    
    var obj = []
    var l = 0
    var prevSem = 1
    for(var i=1;i<cnt;i++){
        var sem = plan[i][0].semester;
        if(sem != prevSem || i+1 == cnt){
            l = 0
            field = 'semester_' + prevSem;
            var tmp = {}
            tmp[field] = obj;
            var ins = {$set: tmp}
            collection.updateOne({"major": maj}, ins, (error, result) => {
                if(error) {
                    return res.status(500).send(error);
                }
            });
            obj = []
        }
        
        var sub = plan[i][1].course.subject;
        var cat = plan[i][1].course.catalog;
        var title = plan[i][1].course.title;
        var cred = plan[i][1].course.credit;
        var crs = {
            'subject': sub,
            'catalog': cat,
            'title': title,
            'cred': cred
        }
        obj.push(crs)
        l += 1;
        prevSem = sem;
    }
    res.json(1);
})

// set majors to updated values
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

router.post("/NewPass", verify.verToken, (req, res) =>{
		var sid = parseInt(req.body.s_id);
		var quer = req.body.query;
		var hash = req.body.hsh;
		var newVal = { $set: hash};
		collection = mongoUtil.getStud();
		collection.updateOne({"s_id": sid}, newval,
		(error, result) => {
			if(error){
				return res.status(500).send(error);
			}
			res.send(result);
		});
});
	
module.exports = router;
