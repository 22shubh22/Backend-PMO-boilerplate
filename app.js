const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL = "mongodb+srv://dbUser:dbUserPassword@cluster0.qdlmb.mongodb.net/PMO?retryWrites=true&w=majority";
const DATABASE_NAME = "database_name_pmo";


var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, client_collection, project_collection;

const Joi = require('@hapi/joi');
const Schema = require('./schema.js')

//client

//GET client list
app.get("/client", (request, response) => {
    client_collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

//GET client by id
app.get("/client/:id", (request, response) => {
    client_collection.findOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

//POST client
app.post("/client", (request, response) => {
    const { value, error } = Schema.validateClient(request.body);
    const valid = error == null;
    if(!valid) {
        response.status(422).json({
            message: 'Invalid request',
            data: request.body
        })
    } else {
        client_collection.insert( value, (error, result) => {
            if(error) {
                return response.status(500).send(error);
            }
            response.send(result);
        });
    }
    
});

//PUT client
app.put("/client/:id", (request, response) => {
    const { value, error } = Schema.validateClient(request.body);
    const valid = error == null;
    if(!valid) {
        response.status(422).json({
            message: 'Client schema dont match',
            data: request.body
        });
    } else {
        client_collection.findOneAndUpdate(
            { "_id": new ObjectId(request.params.id) },
            {
                $set: {
                    name: request.body.name,
                }
            },
            {
                // Will create a new document if document do not exist
                upsert: true
            }
        ).then(result => {
            response.status(200).json({
                message: 'PUT successful',
            });
        })
        .catch(error => response.status(500).send(error))
    }
});

//DELETE client by id
app.delete("/client/:id", (request, response) => {
    var id = request.params.id;
    const c = client_collection.remove({_id:  new ObjectId(request.params.id)});

    // TODO: Remove Promise all
    Promise.all([c]).then(result => {
        console.log(result);
        response.status(200).json({
            message: 'deleted',
        });
    }).catch(err => {
        console.error(err);
        response.status(500).json({
            error: err
        });
    });
    
});

//PROJECT

//GET project list
app.get("/projects", (request, response) => {
    project_collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

//POST a new project
app.post("/projects", (request, response) => {
    const { value, error } = Schema.validateClient(request.body);
    const valid = error == null;
    if(!valid) {
        response.status(422).json({
            message: 'Invalid request',
            data: request.body
        })
    } else {
        client_collection.insert( value, (error, result) => {
            if(error) {
                return response.status(500).send(error);
            }
            response.send(result);
        });
    }
    
});

app.listen(5000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        client_collection = database.collection("client");
        project_collection = database.collection("project");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});