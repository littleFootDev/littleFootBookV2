import {Router} from 'express';
import { getAllUser, getOneUser, createUser, updateUser, deleteUser, getMe } from '../controllers/userControllers';
import { signUp, login, logOut, protect, restricTo} from '../controllers/authController';





const userRoute = Router();

userRoute.post("/signup", signUp);
userRoute.post("/login", login);
userRoute.get("/logout", logOut);
userRoute.get("/me", getOneUser, getMe );

userRoute.use(restricTo('Admin', 'Employé'));
userRoute.get("/", getAllUser);
userRoute.get("/:id", getOneUser);
userRoute.post("/create", createUser);
userRoute.post("/update/:id", updateUser);
userRoute.delete("/delete/:id", deleteUser);

export default userRoute;