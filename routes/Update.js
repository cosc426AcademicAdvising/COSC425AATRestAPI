const router = require("express").Router();
const mongoUtil = require('../mongoUtil');
const verify = require('./token');
var collection;

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
    var min = req.body.min;
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
    var newVal = { $set: p1, p2, p3, p4, p5};
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
		var param = {};
		param[quer] = hsh;
		var newVal = { $set: param};
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
