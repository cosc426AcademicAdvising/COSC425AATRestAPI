const router = require("express").Router();
const { version } = require("joi");
const mongoUtil = require('../mongoUtil');
const verify = require('./token');
var collection;

router.post("/SubmitForm", (req, res) => {
    var tmp = JSON.parse(req.body.form);
    console.log(tmp);
    var id = parseInt(tmp['s_id'])
    collection = mongoUtil.getStud();
    collection.updateOne({
        's_id': id
    },
    {
        '$pull': {
            'taking_course': {
                'cred': {
                    '$gte': 0
                }
            }
        }
    }, function(err, obj) {
        if(err) throw err;
        console.log("Updated");
    })
    collection.updateOne({
        's_id': id
    },
    {
        '$pull': {
            'backup_course': {
                'cred': {
                    '$gte': 0
                }
            }
        }
    }, function(err, obj) {
        if(err) throw err;
        console.log("Updated");
    })
    collection.updateOne({
        's_id': id
    },
    {
        '$set': {
            'memo': tmp.memo
        }
    })
    var cntT = tmp.taking_course.length;
    var obj = []
    for(var i=0;i<cntT;i++){
        var stringArray = tmp.taking_course[i][0].split(/(\s+)/);
        var sub = stringArray[0];
        var cat = stringArray[2];
        var title = tmp.taking_course[i][1];
        var cred = tmp.taking_course[i][2];
        var crs = {
            'subject': sub,
            'catalog': cat,
            'title': title,
            'cred': cred
        }
        obj.push(crs);
        if(i+1 == cntT){
            var p1 = {}
            p1['taking_course'] = obj;
            var ins = {$set: p1}
            collection.updateOne({'s_id': id}, ins);
        }
    }

    var cntB = tmp.backup_course.length;
    obj = [];
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

router.post("/MajorPlan", (req, res) => {
    var plan = req.body;
    cnt = plan.length;
    var maj = plan[0].major
    console.log(plan);
    // console.log(plan[1][0].semester)
    // console.log(plan[1][1].course)
    // console.log(plan[1][1].course.subject)
    
    collection = mongoUtil.getFourYear();
    // collection.deleteOne({'major': maj}, function(err, obj) {
    //     // if(err) throw err;
    //     // console.log('1 doc deleted');
    // });

    // var newDoc = {
    //     'name': "",
    //     'id': "",
    //     'date': "",
    //     'major': maj,
    //     'policies': ""
    // }
    // collection.insertOne(newDoc);
    
    var obj = [];
    var fullobj = [];
    var field = "";
    var sem = 0;
    var inc = 1;
    var cnter = [0, 0, 0, 0, 0, 0, 0, 0];

    // var prevSem = 1
    // for(var i=0;i<8;i++){
    //     var sem = i+1;
        
    // }
    for(var i=1;i<cnt;i++){
        var sem = parseInt(plan[i][0].semester)-1;
        cnter[sem]++;
    }
    console.log(cnter);
    for(var j=0;j<8;j++){
        for(var i=0;i<cnter[j];i++){
            var sem = parseInt(plan[inc][0].semester); 
        
            var sub = plan[inc][1].course.subject;
            var cat = plan[inc][1].course.catalog; 
            var title = plan[inc][1].course.title;
            var cred = plan[inc][1].course.credit;
            var crs = { 
                'subject': sub,
                'catalog': cat,
                'title': title,
                'cred': cred
            }
            obj.push(crs)
            // console.log(i+1);
            // console.log(cnt);
            // if( parseInt(plan[i+1][0].semester) != sem || i+1 === cnt){
            //     // console.log(i);
            //     // console.log(sem);
            //     field = 'semester_' + sem;
            //     var tmp = {}
            //     tmp[field] = obj;
            //     console.log(tmp);
            //     var ins = {$set: tmp}
            //     await collection.updateOne({"major": maj}, ins, (error, result) => {
            //         // if(error) console.log(error);
            //         // console.log(result);
            //     });
            // } 
            inc++;
        }
        field = 'semester_' + sem;
        var tmp = {}
        tmp[field] = obj;
        console.log(tmp);
        var ins = {$set: tmp}
        collection.updateOne({"major": maj}, ins, (error, result) => {
            // if(error) console.log(error);
            // console.log(result);
        });
        obj=[];
    }
    console.log(obj)
    
    // obj = []
    // }
    // var fin = {}
    // fin['comp'] = fullobj;
    // console.log(fullobj);
    // var ins = {$set: fin}
    //         collection.updateOne({"major": maj}, ins, (error, result) => {
    //             if(error) console.log(error);
    //             console.log(result);
    //         });

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
