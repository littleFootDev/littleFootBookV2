import {Router} from "express";
import { getAllBooks, getOneBook, createBook, updateBook, deleteBook } from "../controllers/bookController";

const bookRoute = Router();

bookRoute.get('/', getAllBooks);
bookRoute.get('/:id', getOneBook);
bookRoute.post('/create', createBook);
bookRoute.post('/update/:id', updateBook);
bookRoute.delete('/delete/:id', deleteBook);

export default bookRoute;