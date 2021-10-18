import catchAsync from '../utils/catchAsync';
import AppError from './../utils/appError';
import APIFeatures from '../utils/apiFeatures';

const deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('Aucun document trouvé avec cette id!', 404));
    }

    res.json({
      status: 'success',
      data: null
    });
});

const updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('Aucun document trouvé avec cette id!', 404));
    }

    res.json({
      status: 'success',
      data: {
        data: doc
      }
    });
});

const createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.json({
      status: 'success',
      data: {
        data: doc
      }
    });
});

const getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('Aucun document trouvé avec cette id!', 404));
    }

    res.json({
      status: 'success',
      data: {
        data: doc
      }
    });
});

const getAll = Model => catchAsync(async (req, res, next) => {

    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    
    const doc = await features.query;

    res.json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
});

export {getAll, getOne, deleteOne, updateOne, createOne};