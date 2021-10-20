import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import globalErrorHandler from './controllers/errorController'
import bookRoute from './routes/bookRoute';
import userRoute from './routes/userRoute';
import borrowRoute from './routes/borrowRoute';
import viewsRoute from './routes/viewsRoute';


dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(helmet());

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("DB connection successfully"));

const limiter = rateLimit({
   max : 100,
   windowMs: 60 * 60 * 1000,
   message :'Trop de requete venant de cette IP, réessailler dans 1h!' 
});

app.use('/', limiter);



app.use(express.urlencoded({extended : true}));
app.use(express.json({limit: '10kb'}));

app.use(mongoSanitize());

app.use(xss());

app.use(
    hpp({
    whitelist: [
        'title',
        'relaseDate',
        'author',
        'type'
      ]
    })
);

app.use(express.static(path.join(__dirname, 'puplic')));

app.use('/', viewsRoute);
app.use('/books', bookRoute);
app.use('/users', userRoute);
app.use('/borrow', borrowRoute);



app.use(globalErrorHandler);
app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});