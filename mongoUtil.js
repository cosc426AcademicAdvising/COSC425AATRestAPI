/*

Mongo DB Utility Functions
Includes connection to the database
Returns collection variable for each collection in database

*/

const mongo = require('mongodb').MongoClient;
const mongoose = require('mongoose');

var db, collection;

// connect to db
module.exports = {
    // Connect to MongoDB Database
    connectToServer: function(callback) {
        mongo.connect(process.env.DB_CONNECT,
        {useNewUrlParser: true},
        {useUnifiedTopology: true}, function(err, client) {
            db = client.db('COSC425AAT');
            return callback(err);
        });
        mongoose.connect(process.env.DB_CONNECT,
            {useNewUrlParser: true},
            {useUnifiedTopology: true}, function(err, client) {
            });
    },
    
    // Returns database collection access varaible
    getDb: function(){
        return db;
    },

    // Returns database 'Department' collection access varaible
    getDept: function(){
        collection = db.collection("Department");
        return collection;
    },

    // Returns database 'Student' collection access varaible
    getStud: function(){
        collection = db.collection("Student");
        return collection;
    },

    // Returns database 'Course' collection access varaible
    getCourse: function(){
        collection = db.collection("Course");
        return collection;
    },

    // Returns database 'Four Year' collection access varaible
    getFourYear: function(){
        collection = db.collection("FourYear");
        return collection;
    },

    // Returns database 'Minor Plan' collection access varaible
    getMinPlan: function(){
        collection = db.collection("MinPlan");
        return collection;
    },

    // Returns database 'API_Access' collection access varaible
    getApiAccess: function(){
        collection = db.collection("API_Access");
        return collection;
    },

    getDraft: function(){
        collection = db.collection("Draft");
        return collection;
    },
    
    getTest: function(){
        collection = db.collection("test");
        return collection;
    }
};
