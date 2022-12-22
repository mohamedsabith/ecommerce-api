import Joi from 'joi';
import { failedResponse } from '../helpers/response.js';

export default (err, req, res, next) => {
  if (err instanceof Joi.ValidationError) {
    return res.status(400).json(failedResponse(err.message.replace(/"/g, ''), 400, 'VALIDATION_ERROR'));
  }

  if (['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError'].includes(err.name)) {
    return res.status(401).json(failedResponse(err.message, 401, err.name));
  }
};
