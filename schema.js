const Joi = require('@hapi/joi');

module.exports = {
    validateClient: function (client)
    {
        const clientSchema = Joi.object().keys({
            name: Joi.string().required(),
        });
        return Joi.validate(client, clientSchema);    
    }
};
