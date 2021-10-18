import Book from "../models/book";
import APIFeatures from "../utils/apiFeatures";

const getAllBooks = async (req, res, next) => {
    try {
        let filter = {};

        const feature = new APIFeatures(Book.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const books = await feature.query;

        res.status(200).json({ 
            status : "success",
            results: books.length,
            data: {
                data: books
            }
        });
    } catch (err) {
        console.log(`Les livres non pas était trouvés : ${err.message}`);
        next(err);
    }
};

const createBook = async (req, res, next) => {
    try {
        const newBook = await Book.create(req.body);

        res.status(201).json({ 
            status : "success",
            data: {
                data: newBook
            }
        });
    } catch (err) {
        console.log(`Une erreur c'est produite lors de la création du livre : ${err.message}`);
        next(err);
    }
};

const deleteBook = async (req, res, next) => {
    try {
        const bookId = await Book.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status : "success",
            data : {
                data : null
            }
        });
    } catch (err) {
        console.log(`Une erreur c'est produite lors de la suprèssion d'un livre : ${err.message}`);
        next(err);
    }
};

const updateBook = async (req, res, next) => {
    try {
        const updateBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators : true
        });


        res.status(200).json({
            status : "success",
            data : {
                data : updateBook
            }
        });
    } catch (err) {
        console.log(`Une erreur c'est produite lors des modification sur le livre : ${err}`);
        next(err);
    }
};

const getOneBook = async (req, res, next) => {
    try {
        const bookId = await Book.findById(req.params.id);

        res.status(200).json({
            status : "success",
            data : {
                data : bookId
            }
        });
    } catch (err) {
        console.log(`Aucun livre n'a était trouvé avec cette id : ${err}`);
        next(err);
    }
};


export {getAllBooks, createBook, deleteBook, updateBook, getOneBook};