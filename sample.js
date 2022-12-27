const Joi = require('joi');

const validateData = (data) => {
  const Schema = Joi.object({
    mobile: Joi.string().label('Phone Number'),
    email: Joi.string().email().label('Email'),
  })
    .when(
      Joi.object({
        email: Joi.string().valid(null, ''),
      }).unknown(),
      {
        then: Joi.object({
          mobile: Joi.string().required().label('Mobile').messages({ 'any.required': 'Mobile or email is required' }),
        }),
      }
    )
    .when(
      Joi.object({
        email: Joi.exist(),
      }).unknown(),
      {
        then: Joi.object({
          mobile: Joi.valid(null).messages({
            'any.only': 'You cannot use mobile and email at the same time',
          }),
        }),
      }
    );
  return Schema.validate(data);
};

const dataValidation = validateData({
  mobile: '123',
  email: 'mailto:ok@gmail.com',
});

if (dataValidation.error) {
  const message = dataValidation.error.details[0].message.replace(/"/g, '');
  console.log(message);
}