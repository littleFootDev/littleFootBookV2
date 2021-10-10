import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import bookRoute from './routes/bookRoute';
import userRoute from './routes/userRoute';


dotenv.config();
const port = process.env.PORT;
const app = express();

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("DB connection successfully"));

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use('/books', bookRoute);
app.use('/users', userRoute);

app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});