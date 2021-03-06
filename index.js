/*

Root file for API
Main package is Express
Written in Node js

Initializes all API directories, direcotory routes, 
and Mondo DB database connection

*/

const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongo = require('mongodb');

// import routes
const mongoUtil = require('./mongoUtil');
const deptRoute = require('./routes/Department');
const studRoute = require('./routes/student');
const fourRoute = require('./routes/fouryear');
const courseRoute = require('./routes/Course');
const authRoute = require('./routes/auth');
const minRoute = require('./routes/Minor');
const updateRoute = require('./routes/Update');
const draftRoute = require("./routes/Draft");

dotenv.config();

// connect to db
mongoUtil.connectToServer( function(err, client) {
    
    if(err) console.log(err);
});

// middleware
app.use(express.json());

// route middleware
app.use('/api/user', authRoute);
app.use('/api/Department', deptRoute);
app.use('/api/Student', studRoute);
app.use('/api/FourYear', fourRoute);
app.use('/api/Course', courseRoute);
app.use('/api/MinPlan', minRoute);
app.use('/api/Update', updateRoute);
app.use('/api/Draft', draftRoute);

// server
app.listen(process.env.PORT || 5000)
