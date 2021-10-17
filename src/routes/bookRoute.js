import {Router} from "express";
import { getAllBooks, getOneBook, createBook, updateBook, deleteBook } from "../controllers/bookController";
import {protect, restrictTo} from "../controllers/authController";

const bookRoute = Router();

bookRoute.get('/', protect, getAllBooks);
bookRoute.get('/:id',protect, getOneBook);
bookRoute.post('/create',protect, restrictTo("Admin", "Employé"), createBook);
bookRoute.post('/update/:id', protect, restrictTo("Admin", "Employé"), updateBook);
bookRoute.delete('/delete/:id',protect, restrictTo("Admin", "Employé"), deleteBook);

export default bookRoute;