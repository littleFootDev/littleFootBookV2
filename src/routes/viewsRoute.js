import {Router}  from 'express';
import { home } from '../controllers/viewsController';
import {signUp, logIn, protect, restrictTo, forgotPassword, resetPassword, updatePassword, logOut, isLoggedIn}  from '../controllers/authController';


const viewsRoute = Router();

viewsRoute.get('/', home);

export default viewsRoute;