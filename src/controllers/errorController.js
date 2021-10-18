import AppError from "../utils/appError";

const handleCasteErrorDB = err => {
    const message =  `Invalide ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  
    const message = `Valeur dupliqué: ${value}. Enter une autre valeur!`;
    return new AppError(message, 400);
};
  
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
  
    const message = `Entrée non valide. ${errors.join('. ')}`;
    return new AppError(message, 400);
};
  
const handleJWTError = () => new AppError('Token invalid! Connectée vous à nouveau', 401);
  
const handleJWTExpiredError = () => new AppError('Votre token à expiré! Connecté vous à nouveau', 401);
  
const sendErrorDev = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
      return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
      });
    }
  
    // B) RENDERED WEBSITE
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).render('error', {
      title: "Une erreur c'est produite",
      msg: err.message
    });
};

const sendErrorProd = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
      // A) opérationnel, erreur : envoyer un message au client
      if (err.isOperational) {
        return res.status(err.statusCode).json({
          status: err.status,
          message: err.message
        });
      }
      // 1) Log error
      console.error('ERROR 💥', err);
      return res.status(500).json({
        status: 'error',
        message: "Une erreur c'est produite!'"
      });
    }
  
    // B) Site Operationel
    // A) opérationnel, erreur : envoyer un message au client
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: "Une erreur c'est produite !'",
        msg: err.message
      });
    }
    // 1) Log error
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).render('error', {
      title: "Une erreur c'est produite!'",
      msg: "Reesailler plus tard"
    });
};


const globalErrorHandler = (err, req, res, next) => {
  
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err };
      error.message = err.message;
  
      if (error.name === 'CastError') error = handleCastErrorDB(error);
      if (error.code === 11000) error = handleDuplicateFieldsDB(error);
      if (error.name === 'ValidationError')
        error = handleValidationErrorDB(error);
      if (error.name === 'JsonWebTokenError') error = handleJWTError();
      if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
  
      sendErrorProd(error, req, res);
    };
};

export default globalErrorHandler;
  