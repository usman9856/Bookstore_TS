"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserById = exports.getUserById = exports.signUpPerson = exports.logInPerson = void 0;
const db_schema_person_1 = __importDefault(require("../database/db_schema_person")); // Import the person model
const asyncErrorHanlder_1 = __importDefault(require("../error_manager/asyncErrorHanlder"));
const customError_1 = __importDefault(require("../error_manager/customError"));
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords
const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt hashing
const updateUserById = (0, asyncErrorHanlder_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("updateUserById called");
    try {
        // Extract personId from the request parameters
        const { personId } = req.params;
        // Extract updated data from the request body
        const { firstName, lastName, access, email, library, orderHistory } = req.body;
        console.log("Request Parameter: ", personId);
        console.log("Request Body: ", req.body);
        // Find the person by personId in the database
        const person = yield db_schema_person_1.default.findOne({ person_id: personId });
        if (!person) {
            return next(new customError_1.default("Person not found", 404));
        }
        // Update the person's data
        person.firstName = firstName || person.firstName;
        person.lastName = lastName || person.lastName;
        person.access = access || person.access;
        person.email = email || person.email;
        person.library = library || person.library;
        person.orderHistory = orderHistory || person.orderHistory;
        // Save the updated person
        yield person.save();
        res.status(200).json({
            message: 'Person updated successfully!',
            person: {
                personId: person.person_id,
                firstName: person.firstName,
                lastName: person.lastName,
                access: person.access,
                email: person.email,
                library: person.library,
                orderHistory: person.orderHistory
            }
        });
    }
    catch (error) {
        console.error("Error updating person:", error);
        return next(new customError_1.default("Internal Server Error", 500));
    }
}));
exports.updateUserById = updateUserById;
const getUserById = (0, asyncErrorHanlder_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getUserById called");
    try {
        // Extract personId from the request parameters
        const { personId } = req.params;
        console.log("Request Parameter: ", personId);
        // Find the person by personId in the database
        const person = yield db_schema_person_1.default.findOne({ person_id: personId });
        if (!person) {
            return next(new customError_1.default("User not found!", 404));
        }
        res.status(200).json({
            person: {
                personId: person.person_id,
                firstName: person.firstName,
                lastName: person.lastName,
                access: person.access,
                email: person.email,
                library: person.library,
                orderHistory: person.orderHistory
            }
        });
    }
    catch (error) {
        return next(new customError_1.default("Internal Server Error", 500));
    }
}));
exports.getUserById = getUserById;
// Function to handle user login
const logInPerson = (0, asyncErrorHanlder_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Login Person Called");
    console.log("req.body: ", req.body);
    try {
        const { email, password } = req.body; // Extract email and password from request body
        // Find the person by email in the database
        const person = yield db_schema_person_1.default.findOne({ email });
        if (!person) {
            return (next(new customError_1.default("Invalid email or password", 401)));
        }
        // Compare the provided password with the stored hashed password
        const isMatch = yield bcrypt.compare(password, person.password);
        if (!isMatch) {
            return (next(new customError_1.default("Invalid email or password", 401)));
        }
        // Return success response with person details
        res.status(200).json({
            message: 'Login successful',
            person: {
                personId: person.person_id,
                firstName: person.firstName,
                lastName: person.lastName,
                access: person.access,
                email: person.email,
                library: person.library,
                orderHistory: person.orderHistory
            }
        });
    }
    catch (error) {
        return (next(new customError_1.default("Internal Server Error", 500)));
    }
}));
exports.logInPerson = logInPerson;
// Function to handle user signup
const signUpPerson = (0, asyncErrorHanlder_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Signup Person Called");
    console.log("req.body: ", req.body);
    try {
        const { firstName, lastName, email, password } = req.body; // Extract fields from request body
        let access;
        if (req.body.access == undefined) {
            access = 'user';
        }
        // Check if the person already exists
        const existingPerson = yield db_schema_person_1.default.findOne({ email });
        if (existingPerson) {
            return (next(new customError_1.default("Signup Failed Id already exists", 400)));
        }
        // Hash the password using bcrypt
        const hashedPassword = yield bcrypt.hash(password, SALT_ROUNDS);
        let person_id;
        // Generate a unique person ID
        while (true) {
            person_id = generatePersonId(); // Generate a new ID
            const result = yield db_schema_person_1.default.findOne({ person_id }); // Check if ID already exists
            if (!result) {
                break; // Break the loop if the ID is unique
            }
        }
        // Create a new person with the provided details
        const newPerson = new db_schema_person_1.default({
            person_id,
            firstName,
            lastName,
            access,
            email,
            password: hashedPassword, // Store hashed password
            library: [], // Initialize library with an empty array
            orderHistory: [] // Initialize orderHistory with an empty array
        });
        // Save the new person to the database
        yield newPerson.save();
        res.status(201).json({ message: 'Person registered successfully' }); // Return success response
    }
    catch (error) {
        return (next(new customError_1.default("Internal Server", 500)));
    }
}));
exports.signUpPerson = signUpPerson;
// Function to generate a unique person ID
const generatePersonId = () => {
    const year = new Date().getFullYear(); // Get the current year
    const identifier = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
    return `${year}_${identifier}`; // Return a string combining year and identifier
};
