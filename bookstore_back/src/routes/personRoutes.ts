// Import the Router function from Express and the controller functions
import { Router } from 'express'; // Router function for defining routes
import { logInPerson, signUpPerson } from '../controller/personController'; // Import controller functions for login and signup

// Create an instance of the Router
const router = Router();
// Define a GET route for the '/Login' endpoint
router.post('/Login', logInPerson); // Route handler for logging in a person
// Define a POST route for the '/Signup' endpoint
router.post('/Signup', signUpPerson); // Route handler for signing up a new person

// Export the router to be used in other parts of the application
export default router;
