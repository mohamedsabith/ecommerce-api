import Joi from 'joi';
import BadRequest from '../helpers/exception/badRequest.js';
import { failedResponse } from '../helpers/response.js';

export default (err, req, res, next) => {
  if (err instanceof Joi.ValidationError) {
    return res.status(400).json(failedResponse(err.message.replace(/"/g, ''), 400, 'VALIDATION_ERROR'));
  }

  if (err instanceof BadRequest) {
    console.log('error');
    return res.status(400).json(failedResponse(err.message, err.statusCode, err));
  }

  if (['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError'].includes(err.name)) {
    return res.status(401).json(failedResponse(err.message, 401, err.name));
  }
};
