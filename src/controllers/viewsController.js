import Book from '../models/book';
import User from '../models/user';
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

    if(!book) {
        return next(new AppError("Aucunb livre avec ce nom.", 404))
    }
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

const getAccount = (req, res, next) => {
    res.render("account", {
        title: 'Votre compte'
    });
};

const updateUserData =  catchAsync(async(req, res, next) => {
    const updateUser = await User.findByIdAndUpdate(req.user.id, {
        email: req.body.email,
        numberOfStreet : req.body.address.numberOfStreet,
        nameOfStreet : req.body.address.nameOfStreet,
        zipCode : req.body.address.zipCode
    }, {
        new : true,
        runValidators : true,
    });
    res.render("account", {
        title: 'Votre compte',
        user : updateUser
    });

});

export {home, getSignupForm, postSignupForm, getCatalogue, getBook, getLoginForm, getAccount, updateUserData};