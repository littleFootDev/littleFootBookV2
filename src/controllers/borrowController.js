import Borrow from "../models/borrow";
import catchAsync from "../utils/catchAsync";
import {getAll, getOne, deleteOne, updateOne} from './handlerFactory';

const getParramsBorrow = (req) => {
    let bookId = req.params.id;
    let currentUser = req.user;

    return {
        user : currentUser,
        book : bookId,
        dateOfBorrow: Date.now(),
        dateOfreturn : dateOfBorrow.addDays(21)
    };
};


const borrowCreate = catchAsync(async (req, res, next) => {
    

    const borrow = await Borrow.create(getParramsBorrow());

    res.json({
        status : 'success',
        data: {
            borrow
        }
    });
});


const getAllBorrow = getAll(Borrow);
const getOneBorrow = getOne(Borrow);
const deleteBorrow = deleteOne(Borrow);
const updateBorrow = updateOne(Borrow);

export {borrowCreate, getAllBorrow, getOneBorrow, deleteBorrow, updateBorrow};