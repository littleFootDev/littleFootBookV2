import User from '../models/user';
import {getAll, getOne, deleteOne, updateOne} from './handlerFactory';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });

    return newObj;
};

const createUser = (req, res) => {
    res.json({
        status: 'error',
        message: "Cette route n'est pas defini! utilisé /signup"
    });
};
const updateMe = catchAsync( async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
            return next(new AppError("c'est route n'est pas faite pour modifier le mot de passe. Utilisé /updateMyPassword", 400));
    };
    const filterdBody = filterObj(req.body, 'name', 'lastName', 'email', 'adress.numberOfStreet', 'adress.nameOfStreet', 'adress.zipCode');
    const updateUser = await User.findByIdAndUpdate(req.user.id, filterdBody, { 
        new : true,
        runValidators : true,
    });

    res.json({
        status : 'success',
        data : {
            user : updateUser,
        }
    });
});

const deleteMe = catchAsync( async (req, res,next) => {
    await User.findByIdAndUpdate(req.user.id, {active : false});

    res.json({
        status : 'success',
        data : null
    })
});
const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};


const getAllUser = getAll(User);
const getOneUser = getOne(User);
const updateUser = updateOne(User);
const deleteUser =  deleteOne(User);


export {getAllUser, getOneUser, createUser, updateUser, deleteUser, getMe, updateMe, deleteMe};