const Joi = require('@hapi/joi');

//TODO: check if correct fields are marked as required.
//TODO: check date field is correctly handled as string.

const taskNoteSchema = Joi.object().keys({
    task_id: Joi.string().required(),
    note: Joi.string().required(),
    created_by: Joi.string().required(),
});

const mediaSchema = Joi.object().keys({
    title: Joi.string(),
    path: Joi.string().required(),
    type: Joi.string().required(),
    created_by: Joi.string().required(),
});

const taskSchema = Joi.object().keys({
    milestone_id: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string(),
    assinged_to: Joi.string(),
    due_date: Joi.string(),
    completed_on: Joi.string(),
    comments_allowed: Joi.boolean(),
    created_by: Joi.string().required(),
    notes: Joi.array().items(taskNoteSchema),
    media: Joi.array().items(mediaSchema),
});

const milestoneSchema = Joi.object().keys({
    project_id: Joi.string().required(),
    title: Joi.string(),
    due_date: Joi.string(),
    tasks: Joi.array().items(taskSchema),
});

const componentsSchema = Joi.object().keys({
    title: Joi.string().required(),
    project_id: Joi.string().required(),
});

module.exports = {
    
    validateClient: function (client)
    {
        const clientSchema = Joi.object().keys({
            name: Joi.string().required(),
        });
        return Joi.validate(client, clientSchema);    
    },

    validateProject: function (project)
    {
        const projectSchema = Joi.object().keys({
            title: Joi.string().required(),
            client_id: Joi.string().required(),
            milestones: Joi.array().items(milestoneSchema),
            components: Joi.array().items(componentsSchema),
        })
        return Joi.validate(project, projectSchema);
    },

    validateProjectTest: function (projectTest)
    {
        const projectTestSchema = Joi.object().keys({
            title: Joi.string().required(),
            client_id: Joi.string().required(),
            components: Joi.array().items(componentsSchema),
        })
        return Joi.validate(projectTest, projectTestSchema);
    }
};
