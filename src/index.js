import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import globalErrorHandler from './controllers/errorController'
import bookRoute from './routes/bookRoute';
import userRoute from './routes/userRoute';
import borrowRoute from './routes/borrowRoute';
import viewsRoute from './routes/viewsRoute';


dotenv.config();
const port = process.env.PORT;
const app = express();

app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:'],
   
        fontSrc: ["'self'", 'https:', 'data:'],
  
        scriptSrc: ["'self'", 'unsafe-inline'],
   
        scriptSrc: ["'self'", 'https://*.cloudflare.com'],
   
        scriptSrcElem: ["'self'",'https:', 'https://*.cloudflare.com'],
   
        styleSrc: ["'self'", 'https:', 'unsafe-inline'],
   
        connectSrc: ["'self'", 'data', 'https://*.cloudflare.com']
      },
    })
  );



const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("DB connection successfully"));

//const limiter = rateLimit({
   //max : 100,
   //windowMs: 60 * 60 * 1000,
   //message :'Trop de requete venant de cette IP, réessailler dans 1h!' 
//});

//app.use('/', limiter);

app.use(cors({
    credentials: true,
    origin: 'http://localhost:4567'
  })
);

app.use('*', cors());

app.set("view engine", "pug");
app.set("views",path.join( __dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));



app.use(express.urlencoded({extended : true}));
app.use(express.json({limit: '10kb'}));
app.use(cookieParser());

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

app.use((req, res, next) => {
  res.set(
    'Content-Security-Policy',
    'connect-src *'
  );
  next();
}); 

app.use('/', viewsRoute);
app.use('/books', bookRoute);
app.use('/users', userRoute);
app.use('/borrow', borrowRoute);



app.use(globalErrorHandler);
app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});