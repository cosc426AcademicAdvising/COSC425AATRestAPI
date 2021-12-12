# Restful API for COSC426 Academic Advising Tool and Academic Planner

## Description
Written in Nodejs with Express framework and integrated with a Mongo DB Database.  This Rest API allows for database integration between the Academic Advising Tool and Academic Planner.  Utilizes Paseto tokens for a public key authentication system to authenticate users requesting access via get or post requests.

## Installation

Use the package manager [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install the following Nodejs modules.

```bash
npm install -g npm

```

## Modules
[Express](https://www.npmjs.com/package/express)<br/>
[Joi](https://www.npmjs.com/package/@hapi/joi)<br/>
[Bcrypt](https://www.npmjs.com/package/bcryptjs)<br/>
[Body Parser](https://www.npmjs.com/package/body-parser)<br/>
[Crypto](https://www.npmjs.com/package/cryptojs)<br/>
[Dotenv](https://www.npmjs.com/package/dotenv)<br/>
[MongoDB](https://www.npmjs.com/package/mongodb)<br/>
[Mongoose](https://www.npmjs.com/package/mongoose)<br/>
[Paseto](https://www.npmjs.com/package/paseto)<br/>
[TypeScript](https://www.npmjs.com/package/typescript)<br/>
```bash
npm install express
npm install @hapi/joi
npm install bcryptjs
npm install body-parser
npm install crypto-js
npm install dotenv
npm install mongodb
npm install mongoose
npm install paseto
npm install typescript
```

## Usage

```js
/////////////////////
// Index.js
/////////////////////

// Initializes app to use express
const express = require('express');
const app = express();

// Require MongoDB module
const mongo = require('mongodb');

// import routes used throughout app
const mongoUtil = require('./mongoUtil');
const deptRoute = require('./routes/Department');

// connect to Mongodb Database
mongoUtil.connectToServer( function(err, client) {

    if(err) console.log(err);
});

// Initialize middleware to use json
app.use(express.json());

// route middleware to specify API url access points for specified routes
app.use('/api/user', authRoute);
app.use('/api/Department', deptRoute);

// Start server with specified port
app.listen(process.env.PORT || 5000)



/////////////////////
// verify
////////////////////

// Require paseto
const paseto = require('paseto');
// V2 paseto sign and verify functions
const { V2: { sign } } = paseto;
const { V2: { verify } } = paseto;
// Require crypto for cryptographic algorithms
const crypto = require('crypto');


// Exports for generate token and verifying tokens
module.exports = {
    // Generates a public and private keypair tokens
    genToken: async () => {
        const token = await sign(payload, privkey);
        return token;
    },
    // Verifies a given public key token and will grant access if valid
    // Will specify Invalid token if invalid
    // Will respond with access denied if no token presented
    verToken: async (req, res, next) => {
        const token = req.header('auth-token');
        if(!token) return res.status(401).send('Access Denied');
        try{
            const verified = await verify(String(token), pubkey);
            next();
        } catch (err){
            res.status(400).send('Invalid Token');
        }
    }
}



////////////////////
// routes
////////////////////

// Require express, mongodb connections, and Paseto authentication
const router = require("express").Router();
const mongoUtil = require('../mongoUtil');
const verify = require('./token');

// Post requests
// Data is packed in body of requests
// "/Regex" is URL address preceded by route defined in index
// verify.verToken authenticates public paseto token packed in header
// Will update database with body data
// And/Or return any necessary data
router.post("/Regex", verify.verToken, (req, res) => {
    var plan = req.body.plan;
});


// Get Request
// "/MajorSchool" is URL address preceded by route defined in index
// verify.verToken authenticates public paseto token packed in header
// Will return necessary data
router.get("/MajorSchool", verify.verToken, (req, res) => {

});

```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Authors
Created by Quincy Dennis, Brian Redderson, Florent Dondjeu Tschoufack, and Devin Schmidt.
