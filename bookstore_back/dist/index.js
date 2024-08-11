"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_connect_1 = __importDefault(require("./database/db_connect"));
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const app = (0, express_1.default)();
const port = 5000;
// Connect to the database
(0, db_connect_1.default)();
// Middleware to parse JSON bodies
app.use(express_1.default.json());
//API call
app.use('/Book', bookRoutes_1.default);
app.use('/Order', orderRoutes_1.default);
// Start the server
app.listen(port, () => {
    console.log(`Server listening on port: http://localhost:${port}`);
});
