import {Router} from 'express';
import { getAllUser, getOneUser, createUser, updateUser, deleteUser } from '../controllers/userControllers';


const userRoute = Router();


userRoute.get("/", getAllUser);
userRoute.get("/:id", getOneUser);
userRoute.post("/create", createUser);
userRoute.post("/update/:id", updateUser);
userRoute.delete("/delete/:id", deleteUser);

export default userRoute;