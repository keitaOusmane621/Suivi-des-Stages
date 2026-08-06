const Joi = require('joi');

const messageSchemas = {
  sendMessage: Joi.object({
    conversationId: Joi.string().required(),
    content: Joi.string().required().min(1).max(2000),
    messageType: Joi.string().valid('text', 'file', 'image', 'offer', 'application'),
    fileUrl: Joi.string().uri().when('messageType', {
      is: Joi.string().valid('file', 'image'),
      then: Joi.required()
    }),
    fileName: Joi.string().when('messageType', {
      is: Joi.string().valid('file', 'image'),
      then: Joi.required()
    })
  }),

  startConversation: Joi.object({
    receiverId: Joi.string().required(),
    initialMessage: Joi.string().min(1).max(2000)
  }),

  reactToMessage: Joi.object({
    emoji: Joi.string().required().max(10)
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    next();
  };
};

module.exports = {
  messageSchemas,
  validate
};