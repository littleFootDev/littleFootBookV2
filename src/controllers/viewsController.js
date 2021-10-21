import Book from '../models/book';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

const home = (req, res, next) => {
    res.render("home");
};

const getCatalogue = catchAsync (async(req, res, ) => {
    const books = await Book.find();


    res.render("catalogue", {
        title: "Catalogue",
        books
    });
});

const getBook = catchAsync (async(req, res, ) => {
    const book = await Book.findById(req.params.id);

    res.render("book", {
        title : book.title,
        book
    });
});

const getLoginForm = (req, res, next) => {
    res.set(
        'Content-Security-Policy',
        "script-src 'self' http:127.0.0.1:4567 'unsafe-inline' 'unsafe-eval';"
      ).render("login", {
        title : "Connection"
    });
};
const getSignupForm = (req, res, next) => {
    res.render("signup");
};

const postSignupForm = (req, res, next) => {
    res.redirect('/');
};

export {home, getSignupForm, postSignupForm, getCatalogue, getBook, getLoginForm};