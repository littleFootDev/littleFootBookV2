import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import AppError from '../utils/appError';

const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    
    res.cookie('jwt', token, { 
        expiresIn: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });


    res.status(statusCode).json({
        status : "success",
        token,
        data : {
            user,
        },
    });
};

const signUp = async (req, res, next) => {
   try {
    const newUser = await User.create(req.body);

    const url = `${req.protocol}://${req.get("host")}/me`;

    createSendToken(newUser, 201, res);
   } catch (err) {
    console.log(`Erreur dans la création du compte :  ${err.message}`);
   }
};

const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return next(new AppError('Please provide email and password!', 400));
        };

        const user = await User.findOne({email}).select("+password");

        if(!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401));
        };

    createSendToken(user, 200, res);
    } catch (err) {
        console.log(`Erreur lors de la connection au compte:  ${err.message}`);
    }
};

const logOut =  (req, res, next) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly : true,
    });

    res.status(200).json({status: "success"});
};

const protect = async (req, res, next) => {
   try {
        let token;

        if(
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookie.jwt) {
            token = req.token.jwt;
        };

        if(!token) {
            return next(
                new AppError("Vous n'étes pas connecté. Veuillez vous connecter pour avoir acces au catalogue", 401)
              );
        };

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id);
        if(!currentUser) {
            return next(
                new AppError(
                  "L'utilisateur qui ésaille de ce connecté existe pas.",
                  401
                )
              );
        };

        req.user = currentUser;
        res.locals.user = currentUser
        next();
   } catch (err) {
    console.log(`L'utilisateur n'a pas l'autorisation d'accedé a ces pages:  ${err.message}`);
   }
};

const isLoggedIn = async (req, res, next) => {
    try {
        if(req.cookie.jwt) {
            try {
                const decoded = await promisify(jwt.verify)(
                    req.cookie.jwt,
                    process.env.JWT_SECRET
                );

                const currentUser = await User.findById(decoded.id);
                if(!currentUser) {
                    return next();
                };

                res.locals.user = currentUser;
                return next();
            } catch (err) {
                return next(err);
            }
        };
        next();
    } catch (err) {
        console.log(`L'utilisateur n'est pas connecté:  ${err.message}`);
    }
};

const restricTo = (...role) => {
    return (req, res, next) => {
        if(!role.includes(req.user.role)) {
            return next(
                new AppError("Vous n'avez pas la permission pour cette action", 403)
              );
        };
    };
};

export {signUp, login, logOut, protect, isLoggedIn, restricTo};