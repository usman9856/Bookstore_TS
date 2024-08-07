import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect('mongodb+srv://um50765:USEVDnoFKoRaVDmI@cluster0.ervwj.mongodb.net/');
        console.log("Database Connected!");
    } else {
        console.log("Database Already Connected!");
    }
};

export default connectDB;
