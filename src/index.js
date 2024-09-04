import connectDB from './config/dbconfig.js';
import app from './app.js';
import dotenv from 'dotenv';
dotenv.config({
  path: "/.env",
});



const PORT = process.env.PORT || 8000;
// db connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}).catch((err) => {
    console.log("MongoDB Connection Error",err);
})