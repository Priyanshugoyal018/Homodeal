const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const registerValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
    validate,
];

const loginValidation = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
];

const propertyValidation = [
    body('location').notEmpty().withMessage('Location is required'),
    body('propertyCategory').isIn(['rental', 'sale', 'commercial', 'plot']).withMessage('Invalid property category'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('propertyName').optional().isString(),
    validate,
];


const interestValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('propertyId').notEmpty().withMessage('Property ID is required'),
    validate,
];

module.exports = {
    registerValidation,
    loginValidation,
    propertyValidation,
    interestValidation,
};