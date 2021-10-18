import Book from "../models/book";
import {getAll, getOne, deleteOne, updateOne, createOne} from "./handlerFactory";
//import AppError from "../utils/appError";

const getAllBooks = getAll(Book);
const createBook = createOne(Book);
const deleteBook = deleteOne(Book);
const updateBook = updateOne(Book);
const getOneBook = getOne(Book);


export {getAllBooks, createBook, deleteBook, updateBook, getOneBook};