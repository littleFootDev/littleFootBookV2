import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/user';


const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = { 
        expires : new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly : true,
    };
    if(process.env.MODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);

    res.status(statusCode).json({
        status : "success",
        token,
        data : {
            user,
        },
    });
};

const signUp = async (req, res, next) => {
    const newUser = await User.create(req.body);

    const url = `${req.protocol}://${req.get("host")}/me`;

    createSendToken(newUser, 201, res);
};

const login = async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        console.log(`Entrer un email et un mot de passe ${err.message}`);
        return next(err);
    };

    const user = await User.findOne({email}).select("+password");

    if(!user || !(await user.correctPassword(password, user.password))) {
        console.log(`Email ou mot de passe invalide ${err.message}`)
        return next(err);
    };

    createSendToken(user, 200, res);
};

const logOut = async (req, res, next) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly : true,
    });

    res.status(200).json({status: "success"});
};

const protect = async (req, res, next) => {
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
        console.log(`Vous n'étes pas connecté! Please connecté vous pour avoir accés au information ${err.message}` );
        return next(err);
    };

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        console.log(`l'utilisateur avec ce token n'existe pas ${err.message}`);
        return next(err);
    };

    req.user = currentUser;
    res.locals.user = currentUser
    next();
}
export {signUp, login, logOut, protect};