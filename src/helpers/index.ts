var ObjectID = require('mongodb').ObjectID;

export const getObjectId = (name: string) => new ObjectID(name);