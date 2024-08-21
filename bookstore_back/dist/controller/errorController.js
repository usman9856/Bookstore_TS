"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (error, // Type `any` can be replaced with your custom error class type if used
req, res, next) => {
    // Set default status code if not provided
    const statusCode = error.statusCode || 500;
    // Set default status if not provided
    const status = error.status || 'error';
    // Send JSON response
    res.status(statusCode).json({
        status,
        message: error.message,
    });
};
