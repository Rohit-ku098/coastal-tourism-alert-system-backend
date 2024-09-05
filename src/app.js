import express from "express";
import { errorMiddleware } from './middleware/error.middleware.js';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();
app.use(bodyParser.json())
app.use(cookieParser())


// fetch data from incois api and store in mongodb database using cron job
// import  './controller/seeding/seedAlertsData.js';
// import  './controller/seeding/seedBeachesData.js';


import { updateBeaches } from './controller/seeding/seedBeachesData.js';
app.post('/admin/update-beaches', async (req, res) => {
    await updateBeaches();
    res.send('beaches updated successfully');
})

import beachRouter from './routes/beach.routes.js';
import userRouter from './routes/user.routes.js';


app.use('/api/v1/beach', beachRouter);
app.use('/api/v1/user', userRouter);
app.use(errorMiddleware);



export default app