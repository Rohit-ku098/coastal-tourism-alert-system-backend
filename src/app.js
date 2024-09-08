import express, { urlencoded } from "express";
import { errorMiddleware } from './middleware/error.middleware.js';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import '../src/models/index.js';
const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(
  urlencoded({
    extended: true,
    limit: "16kb",
  })
);

// fetch data from incois api and store in mongodb database using cron job
import  './controller/seeding/seedAlertsData.js';


import { updateBeaches } from './controller/seeding/seedBeachesData.js';
app.post('/admin/update-beaches', async (req, res) => {
    await updateBeaches();
    res.send('beaches updated successfully');
})

import beachRouter from './routes/beach.routes.js';
import userRouter from './routes/user.routes.js';
import userPreferenceRouter from './routes/userPreference.routes.js';
import userNotificationRouter from './routes/userNotification.routes.js';

app.use('/api/v1/beach', beachRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/user-preference', userPreferenceRouter)
app.use('/api/v1/notification', userNotificationRouter)

app.use(errorMiddleware);



export default app