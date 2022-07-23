var ObjectID = require('mongodb').ObjectID;

export const getObjectId = (name) => new ObjectID(name);