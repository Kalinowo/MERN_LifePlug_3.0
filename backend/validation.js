const Joi = require("joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
    verifyPassword: Joi.ref("password"),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};

const animeValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    engName: Joi.string().required(),
    img: Joi.string().required(),
    year: Joi.string().required(),
    season: Joi.string().required(),
    genre: Joi.string().required(),
    director: Joi.string().required(),
    agent: Joi.string().required(),
    producer: Joi.string().required(),
    blurHash: Joi.string().required(),
    intro: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;

module.exports.loginValidation = loginValidation;

module.exports.animeValidation = animeValidation;
