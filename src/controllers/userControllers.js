import User from '../models/user';
import AppError from '../utils/appError';

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });

    return newObj;
};

const getAllUser = async (req, res, next) => {
    try {
        const users = await User.find({});

        res.status(200).json({
            status : 'success',
            data : {
                data : users
            }
        });
    } catch (err) {
        console.log(`Une erreurc'est produite lors du changements des utilisateur : ${err.message}`);
        next(err)
    }
};

const getOneUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        res.status(200).json({
            status : 'success',
            data : {
                data : user
            }
        });
    } catch (err) {
        console.log(`Aucun utilisateur trouver avec cet Id : ${err.message}`);
        next(err);
    }
}
const createUser = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body);

        res.status(201).json({
            status : 'success',
            data : {
                data : newUser
            }
        });
        
    } catch (err) {
        console.log(`Une erreurc'est produite lors de la création de l'utilisateur : ${err.message}`);
        next(err);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const userId = await User.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators : true
        });

        res.status(200).json({
            status : 'success',
            data: {
                data: userId
            }
        });
    } catch (err) {
        console.log(`Une erreurc'est produite lors de la modification de l'utilisateur : ${err.message}`);
        next(err);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const userSup = await User.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status : 'success',
            data : {
                data : null
            }
        });
    } catch (err) {
        console.log(`Une erreurc'est produite lors de la suppression de l'utilisateur : ${err.message}`);
        next(err);
    }
};

const updateMe = async (req, res, next) => {
    try {
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
    } catch (err) {
        next(err);
    }
}

const deleteMe = async (req, res,next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {active : false});

        res.json({
            status : 'success',
            data : null
        })
    } catch (err) {
        next(err);
    }
}
const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

export {getAllUser, getOneUser, createUser, updateUser, deleteUser, getMe, updateMe, deleteMe};