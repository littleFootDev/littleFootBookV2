import mongoose from 'mongoose';
import User from '../models/user';
import Book from '../models/book';

const borrowSchema = new mongoose.Schema({
    user: {
        type : mongoose.Schema.ObjectId,
        ref : 'User', 
        required : [true, 'Un emprunt doit avoir un utilisateur.']
    },
    book: {
        type : mongoose.Schema.ObjectId,
        ref : 'Book', 
        required : [true, 'Un emprunt doit avoir un livre']
    },
    dateOfBorrow: {
        type : Date,
        default : Date.now()
    },
    dateOfreturn : Date,
});

const Borrow = mongoose.model('Borrow', borrowSchema);

export default Borrow;
