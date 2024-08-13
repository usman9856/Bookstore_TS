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
// Import the mongoose library for interacting with MongoDB
const mongoose_1 = __importDefault(require("mongoose"));
// Function to connect to the MongoDB database
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the database connection is already established
    if (mongoose_1.default.connection.readyState !== 1) {
        // If not connected, establish a new connection to MongoDB
        yield mongoose_1.default.connect('mongodb+srv://um50765:USEVDnoFKoRaVDmI@cluster0.ervwj.mongodb.net/Bookstore');
        console.log("Database Connected!"); // Log a message once the connection is successful
    }
    else {
        // If already connected, log a message indicating the database is already connected
        console.log("Database Already Connected!");
    }
});
// Export the connectDB function for use in other parts of the application
exports.default = connectDB;
