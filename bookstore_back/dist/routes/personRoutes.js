"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the Router function from Express and the controller functions
const express_1 = require("express"); // Router function for defining routes
const personController_1 = require("../controller/personController"); // Import controller functions for login and signup
// Create an instance of the Router
const router = (0, express_1.Router)();
router.get('/:personId', personController_1.getUserById); // Route handler for logging in a person
router.put('/:personId', personController_1.updateUserById); // Route handler for logging in a person
// Define a GET route for the '/Login' endpoint
router.post('/Login', personController_1.logInPerson); // Route handler for logging in a person
// Define a POST route for the '/Signup' endpoint
router.post('/Signup', personController_1.signUpPerson); // Route handler for signing up a new person
// Export the router to be used in other parts of the application
exports.default = router;
