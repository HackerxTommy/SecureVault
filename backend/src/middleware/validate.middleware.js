import Joi from 'joi';

export const validateScanCreate = (req, res, next) => {
  const schema = Joi.object({
    targetUrl: Joi.string().uri().required(),
    targetType: Joi.string().valid('web', 'api', 'repo').required(),
    scanMode: Joi.string().valid('quick', 'standard', 'deep').default('standard')
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};
