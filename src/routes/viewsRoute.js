import {Router}  from 'express';
import { home, getSignupForm, postSignupForm, getCatalogue, getBook, getLoginForm, } from '../controllers/viewsController';
import {signUp, logIn, protect, restrictTo, forgotPassword, resetPassword, updatePassword, logOut, isLoggedIn}  from '../controllers/authController';


const viewsRoute = Router();

viewsRoute.get('/', home);
viewsRoute.get('/catalogue',isLoggedIn, getCatalogue);
viewsRoute.get('/book/:id', getBook);

viewsRoute.get('/login', isLoggedIn, getLoginForm,);
viewsRoute.get('user/signup', getSignupForm);
viewsRoute.post('/user/signup', postSignupForm);

export default viewsRoute;