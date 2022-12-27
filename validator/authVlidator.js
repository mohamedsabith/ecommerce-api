import Joi from 'joi';

export const signupValidation = async (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().required().min(3).lowercase()
      .label('Full name'),
    email: Joi.string().email().required().label('Email'),
    phoneNumber: Joi.number().required().label('Phone number'),
    password: Joi.string().required().min(8).max(20)
      .label('Password'),
    confirmPassword: Joi.any().equal(Joi.ref('password')).required().label('Confirm password')
      .messages({ 'any.only': '{{#label}} does not match' }),
  }).options({ stripUnknown: true });

  req.body = await schema.validateAsync(req.body);
  return next();
};

export const signInValidation = async (req, res, next) => {
  const schema = Joi.object({
    phoneNumber: Joi.number().label('Phone number'),
    email: Joi.string().email().label('Email'),
    password: Joi.string().required().min(8).max(20)
      .label('Password'),
  })
    .when(
      Joi.object({
        email: Joi.string().valid(null, ''),
      }).unknown(),
      {
        then: Joi.object({
          phoneNumber: Joi.number().required().label('Phone number').messages({ 'any.required': 'Phone number or email is required' }),
        }),
      },
    )
    .when(
      Joi.object({
        email: Joi.exist(),
      }).unknown(),
      {
        then: Joi.object({
          phoneNumber: Joi.valid(null).messages({
            'any.only': 'You cannot use Phone number and email at the same time',
          }),
        }),
      },
    );

  req.body = await schema.validateAsync(req.body);
  return next();
};

export const otpValidation = async (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().required().min(3).lowercase()
      .label('Full name'),
    email: Joi.string().email().required().label('Email'),
    phoneNumber: Joi.number().required().label('Phone number'),
    password: Joi.string().required().min(8).max(20)
      .label('Password'),
    otp: Joi.number().required().max(9999).message('otp maximum 4 digits')
      .min(1000)
      .message('otp must be 4 digits'),
  });
  req.body = await schema.validateAsync(req.body);
  return next();
};
