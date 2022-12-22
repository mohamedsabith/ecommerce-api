import Joi from 'joi';

const signupValidation = async (req, res, next) => {
  const schema = Joi.object({
    fullname: Joi.string().required().min(3).lowercase()
      .label('Full name'),
    email: Joi.string().email().required().label('Email'),
    phoneNumber: Joi.number().required().label('Phone number'),
    password: Joi.string().required().min(8).max(20)
      .label('Password'),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .label('Confirm password')
      .messages({ 'any.only': '{{#label}} does not match' }),
  })
    .options({ stripUnknown: true });

  req.body = await schema.validateAsync(req.body);
  return next();
};

export default signupValidation;
