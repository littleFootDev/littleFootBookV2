import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

const home = (req, res, next) => {
    res.render("index");
};

export {home};