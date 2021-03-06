/*

Login and Registration input vlaidation
Achieved through Joi schemas
Create input requirements for specified input fields

*/

//validation
const Joi = require('@hapi/joi');

// register validation
const registerValidation = data => {
    const schema = Joi.object({
        // Email must be at least 6 chars and of email format and is required
        id: Joi.number().integer().min(6).required(),
        // Password must be  at least 6 chars and is required
        password: Joi.string().min(6).required()
    });

    return schema.validate(data);
};

// login validation
const loginValidation = data => {
    const schema = Joi.object({
        // Email must be at least 6 chars and of email format and is required
        id: Joi.number().integer().min(6).required(),
        // Password must be at least 6 chars and is required
        password: Joi.string().min(6).required()
    });

    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;