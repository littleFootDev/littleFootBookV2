import multer from "multer";
import Book from "../models/book";
import User from "../models/user";
import {borrowCreate} from "./borrowController";
import {getAll, getOne, deleteOne, updateOne, } from "./handlerFactory";
import catchAsync from '../utils/catchAsync';
import AppError from "../utils/appError";

const getAllBooks = getAll(Book);
const deleteBook = deleteOne(Book);
const updateBook = updateOne(Book);
const getOneBook = getOne(Book);

const multerStorage = multer.memoryStorage();

const multerFilter = (req, res, next) => {
    if (file.minetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError("Ce n'est pas une image! Upload juste une image", 400), false)
    }
}

const upload = multer({
    storage : multerStorage,
    fileFilter : multerFilter
});

const uploadBookPhoto = upload.single("photo");

const createBook = catchAsync(async (req, res, next) => {
    const book = await Book.create(req.body);

    if (req.file) book.image = req.file.filename;

    res.json({
      status: 'success',
      data: {
        data: book
      }
    });
});
const BorrowOneBook = catchAsync(async (req, res, next) => {
    let bookId = req.params.id;
    let currentUser = req.user;

    if(currentUser) {
        await User.findByIdAndUpdate(currentUser, {
            $addToSet : {
                books : bookId,
            }
        });
    
      const borrow = await borrowCreate();
    
      return borrow
    };

    res.json({
        status : 'success',
        data : {
            borrow
        }
    });

});

const filterUserBooks =(req, res, next) => {
    let currentUser = req.locals.currentUser;

    if(currentUser) {
        let mappedBooks = res.locals.books.map((book) =>{
            let userBorrow = currentUser.books.some((userBook) => {
                return userBook.equals(book._id);
            });
            return Object.assign(book.toObject(), {borrow : userBorrow})
        });

        res.locals.books = mappedBooks;
        next();

    };
};

const confirmBorrow = catchAsync(async( req, res, next) => {
    const borrow = await Book.findByIdAndUpdate( { 
        $addToSet : {
            available : false
        }
    });

    res.json({
        status : 'success',
        data : {
            borrow
        }
    })
});

export {getAllBooks, createBook, deleteBook, updateBook, getOneBook, BorrowOneBook, filterUserBooks, confirmBorrow, uploadBookPhoto,};