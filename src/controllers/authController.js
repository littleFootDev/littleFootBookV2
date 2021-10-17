import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import AppError from '../utils/appError';


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  };  


const signUp = async (req, res, next) => {
   try {
        const newUser = await User.create(req.body);

        const token = signToken(newUser._id);
        
        res.json({
            status: 'success',
            token,
            data : {
                user : newUser
            }
        });
   } catch (err) {
        return next(new AppError(`Erreur dans la création du compte :  ${err.message}`, 400));
   };
};

const logIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        
        if (!email || !password) {
          return next(new AppError('Entrer un email et un mot de passe!', 400));
        }
    
        const user = await User.findOne({ email }).select('+password');
      
        if (!user || !(await user.correctPassword(password, user.password))) {
          return next(new AppError('Email ou mot de passe incorrecte ', 401));
        }

        const token = signToken(user._id);

        res.json({
            status : 'success',
            token
        });
    } catch (err) {
        return next(new AppError('Entrer un email et un mot de passe valide', 400));
    }
};

const protect = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
          ) {
            token = req.headers.authorization.split(' ')[1];
        };

        if(!token) {
            return next(new AppError("Vous n'êtes pas connecté! Connectez vous pour avoir accés au données",401));
        };
        
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401
            )
            );
        };

        req.user = currentUser;
        res.locals.user = currentUser;
        next();
    } catch (err) {
        return next(new AppError("Vous êtes pas autorisé a voir ce ci! Veuillez vous connecté pour avoir accée", 401));
    }
}

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.roles)) {
            return next(new AppError("Vous n'avais pas l'autorisation pour faire cette action"), 403);
        };

        next();
    };
};

export {signUp, logIn, protect, restrictTo};