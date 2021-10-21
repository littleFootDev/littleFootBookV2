import {Router}  from 'express';
import { home, getSignupForm, postSignupForm, getCatalogue, getBook, getLoginForm, getAccount, updateUserData} from '../controllers/viewsController';
import {signUp, logIn, protect, restrictTo, forgotPassword, resetPassword, updatePassword, logOut, isLoggedIn}  from '../controllers/authController';


const viewsRoute = Router();

viewsRoute.get('/', home);
viewsRoute.get('/catalogue',isLoggedIn, getCatalogue);
viewsRoute.get('/book/:id', getBook);

viewsRoute.get('/signup', getSignupForm);
viewsRoute.post('/signup', postSignupForm);
viewsRoute.get('/login', isLoggedIn, getLoginForm,);
viewsRoute.get('/me',protect ,getAccount);

viewsRoute.post('/submit-user-data',protect,  updateUserData)

export default viewsRoute;