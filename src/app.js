import express from "express";
import { errorMiddleware } from './middleware/error.middleware.js';

const app = express();

// fetch data from incois api and store in mongodb database using cron job
import  './controller/fetchApidata.js';


import { updateBeaches } from './controller/updatebeaches.js';
app.post('/admin/update-beaches', async (req, res) => {
    await updateBeaches();
    res.send('beaches updated successfully');
})

import beachRouter from './routes/beach.routes.js';
app.use('/api/v1/beach', beachRouter);
app.use(errorMiddleware);



export default app