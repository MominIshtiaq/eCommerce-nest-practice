import Joi from 'joi';

export const envValidation = Joi.object({
  ENV_MODE: Joi.string()
    .trim()
    .valid('production', 'development')
    .default('development'),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_AUTO: Joi.boolean().default(true),
  DB_SYNC: Joi.boolean().default(true),
});
