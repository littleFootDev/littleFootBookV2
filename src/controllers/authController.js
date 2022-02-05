import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import AppError from '../utils/appError';
import {sendEmail} from '../utils/email';
import catchAsync from '../utils/catchAsync';


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
}; 


const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  
    res.cookie("jwt", token, cookieOptions);
  
    // Remove password from output
    user.password = undefined;
  
    res.status(statusCode).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  };


const signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    const url = `${req.protocol}://${req.get('host')}/me`

    createSendToken(newUser, 201, res);
});

const logIn = catchAsync( async (req, res, next) => {
    const { email, password } = req.body;

        
    if (!email || !password) {
      return next(new AppError('Entrer un email et un mot de passe!', 400));
    }

    const user = await User.findOne({ email }).select('+password');
  
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Email ou mot de passe incorrecte ', 401));
    }

    createSendToken(user, 200, res);
});

const logOut = (req, res) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });
      res.status(200).json({ status: "success" });
}

const protect = catchAsync (async (req, res, next) => {
    let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
          ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
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

        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(
              new AppError("L'utilisateur à changer de mot de passe ressament. Connecté vous de nouveau", 401)
            );
          }
        

        req.user = currentUser;
        res.locals.user = currentUser;
        next();
});

const isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
          const decoded = await promisify(jwt.verify)(
            req.cookies.jwt,
            process.env.JWT_SECRET
          );
    
          const currentUser = await User.findById(decoded.id);
          if (!currentUser) {
            return next();
          }
    
          if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next();
          }
          res.locals.user = currentUser;
          return next();
        } catch (err) {
          return next();
        }
      }
      next();
};


const restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.roles)) {
            return next(new AppError("Vous n'avais pas l'autorisation pour faire cette action"), 403);
        };

        next();
    };
};

const forgotPassword =catchAsync( async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user) {
        return next(new AppError("Aucun utilisateur trouvé avec cette Email"), 404);
    };

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;

    const message = `Vous avez oublié votre mot de passe ? Utiliser cette adresse pour entrer un nouveau mot de passe et la confirmation to : ${resetUrl}. Si vous n'avais pas oublier votre mot de passe,  ignorer cette email!`;

    try {
    await sendEmail({
        email: user.email,
        subject: 'Votre mot de passe resetToken (valide pour 10min) ',
        message
    });
 
    res.json({
        status : 'success',
        message : 'Token sent to email'
    });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
          
        return next(new AppError("Il y a une erreur dans l'envoi du mail. Esailler plus tard!"), 500);
    }
});

const resetPassword = catchAsync( async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne( {
        passwordResetToken : hashedToken, 
        passwordResetExpires: {$gt : Date.now()}
    });

    if(!user) {
        return next(new AppError('Le token est pas valide ou il a expiré', 400));
    };

    user.password = req.body.password;
     user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    createSendToken(user, 200, res);
});

const updatePassword = catchAsync( async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
        return next(new AppError('Votre mort de passe courent et faut ', 401));
    };

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, res);
});
export {signUp, protect, restrictTo, forgotPassword, resetPassword, updatePassword, logOut, isLoggedIn, logIn};