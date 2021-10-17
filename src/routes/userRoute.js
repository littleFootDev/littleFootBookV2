import {Router} from 'express';
import { getAllUser, getOneUser, createUser, updateUser, deleteUser, getMe, updateMe, deleteMe } from '../controllers/userControllers';
import { signUp, logIn, protect, restrictTo, forgotPassword, resetPassword, updatePassword} from '../controllers/authController';





const userRoute = Router();

userRoute.post('/signup', signUp);
userRoute.post('/login', logIn);

userRoute.post('/forgotPassword', forgotPassword);
userRoute.patch('/resetPassword/:token', resetPassword);

userRoute.get('/me', protect, getMe);
userRoute.patch('/updateMyPassword', protect, updatePassword);
userRoute.patch('/updateMe', protect, updateMe);
userRoute.delete('/deleteMe', protect, deleteMe);

userRoute.get("/",protect, restrictTo("Admin", "Employé"), getAllUser);
userRoute.get("/:id",protect, restrictTo("Admin", "Employé"), getOneUser);
userRoute.post("/create",protect, restrictTo("Admin", "Employé"), createUser);
userRoute.post("/update/:id",protect, restrictTo("Admin", "Employé"), updateUser);
userRoute.delete("/delete/:id",protect, restrictTo("Admin", "Employé"), deleteUser);

export default userRoute;