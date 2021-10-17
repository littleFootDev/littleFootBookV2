import {Router} from 'express';
import { getAllUser, getOneUser, createUser, updateUser, deleteUser, getMe } from '../controllers/userControllers';
import { signUp, logIn, protect, restrictTo} from '../controllers/authController';





const userRoute = Router();

userRoute.post('/signup', signUp);
userRoute.post('/login', logIn);

userRoute.get("/",protect, restrictTo("Admin", "Employé"), getAllUser);
userRoute.get("/:id",protect, restrictTo("Admin", "Employé"), getOneUser);
userRoute.post("/create",protect, restrictTo("Admin", "Employé"), createUser);
userRoute.post("/update/:id",protect, restrictTo("Admin", "Employé"), updateUser);
userRoute.delete("/delete/:id",protect, restrictTo("Admin", "Employé"), deleteUser);

export default userRoute;