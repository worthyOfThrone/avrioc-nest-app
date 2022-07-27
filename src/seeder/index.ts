require('ts-node').register();

const dotenv = require('dotenv');

dotenv.config();

const path = require('path');
const { Seeder } = require('mongo-seeding');

const config = {
	database: process.env.MONGODB_URI,
	dropDatabase: true, //TODO: false
};
const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(
	path.resolve('src/__seedData/'),
	{
		transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
		extensions: ['json'],
	},
);

seeder
	.import(collections)
	.then(() => {
		console.log('Success');
	})
	.catch((err) => {
		console.log('Error', err);
	});
