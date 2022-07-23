const { getObjectId } = require("../../helpers/index");

// import { getObjectId } from 'mongo-seeding';

const names = ["John", "Joanne", "Bob", "Will", "Chris"];

const min = 18;
const max = 100;

module.exports = names.map(name => ({
    firstName: name,
    age: Math.floor(Math.random() * (max - min + 1)) + min,
    _id: getObjectId(name),
}))