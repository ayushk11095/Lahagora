import Joi from "joi";

export default {
    userCreateValidator,
    logInValidator,
    taskCreateValidator,
    taskUpdateValidator,
    listValidator,
    taskUpdateStatusValidator,
}

export async function userCreateValidator(req, res, next) {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mob: Joi.string().required(),
    countryCode: Joi.string().required(),
    isnCode: Joi.string().required(),
    password: Joi.string().required()
  });

  const { error } = await schema.validate(req.body);
  if (error) {
    return next({
      status: 400,
      code: `invalid_params`,
      message: error.details[0].message
  })
  }
  next();
}

export async function logInValidator(req, res, next) {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = await schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
}

export async function taskCreateValidator(req, res, next) {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    dueDate: Joi.string().required(),
  });

  const { error } = await schema.validate(req.body);
  if (error) {
    return next({
      status: 400,
      code: `invalid_params`,
      message: error.details[0].message
  })
  }
  next();
}

export async function taskUpdateValidator(req, res, next) {
  const schema = Joi.object().keys({
    uuid: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string(),
    dueDate: Joi.string().required(),
  });

  const { error } = await schema.validate(req.body);
  if (error) {
    return next({
      status: 400,
      code: `invalid_params`,
      message: error.details[0].message
  })
  }
  next();
}

export async function listValidator(req, res, next) {
  const schema = Joi.object().keys({
    page: Joi.number(),
    pageSize: Joi.number(),
  });

  const { error } = await schema.validate(req.body);
  if (error) {
    return next({
      status: 400,
      code: `invalid_params`,
      message: error.details[0].message
  })
  }
  next();
}

export async function taskUpdateStatusValidator(req, res, next) {
  const schema = Joi.object().keys({
    uuid: Joi.string().required(),
  });

  const { error } = await schema.validate(req.body);
  if (error) {
    return next({
      status: 400,
      code: `invalid_params`,
      message: error.details[0].message
  })
  }
  next();
}