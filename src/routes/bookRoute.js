import {Router} from "express";
import { getAllBooks, getOneBook, createBook, updateBook, deleteBook, BorrowOneBook, filterUserBooks, confirmBorrow, uploadBookPhoto} from "../controllers/bookController";
import {protect, restrictTo} from "../controllers/authController";


const bookRoute = Router();

bookRoute.get('/', protect, getAllBooks);
bookRoute.get('/:id',protect, getOneBook);
bookRoute.get('/myBook/:id', protect, filterUserBooks);
bookRoute.post('/create',protect, restrictTo("Admin", "Employé"),uploadBookPhoto, createBook);
bookRoute.post('/update/:id', protect, restrictTo("Admin", "Employé"), updateBook);
bookRoute.post('takeOneBook', protect, BorrowOneBook);
bookRoute.post('/confirmBorrow', protect, restrictTo("Admin", "Employé"), confirmBorrow);
bookRoute.delete('/delete/:id',protect, restrictTo("Admin", "Employé"), deleteBook);

export default bookRoute;