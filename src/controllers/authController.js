import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import AppError from '../utils/appError';
import {sendEmail} from '../utils/email';


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
}; 

const createSendToken = ( user, statusCode, res) => {
    const token = signToken(user._id);

    res.json({ 
        status : 'success',
        token,
        data : {
            user
        }
    });
};


const signUp = async (req, res, next) => {
   try {
        const newUser = await User.create(req.body);

        createSendToken(newUser, 201, res);
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

        createSendToken(user, 200, res);
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

        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(
              new AppError("L'utilisateur à changer de mot de passe ressament. Connecté vous de nouveau", 401)
            );
          }
        

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

const forgotPassword = async (req, res, next) => {
   try {
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
   } catch (err) {
    return next(new AppError("Utilisateur non trouvé", 401))
   }
};
const resetPassword = async (req, res, next) => {
    try {
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
    } catch (err) {
        return next(err);
    }
};

const updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
            return next(new AppError('Votre mort de passe courent et faut ', 401));
        };

        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();

        createSendToken(user, 200, res);
    } catch (err) {
        next(err);
    }
}
export {signUp, logIn, protect, restrictTo, forgotPassword, resetPassword, updatePassword};