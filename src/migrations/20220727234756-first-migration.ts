module.exports = {
	// adding indexes
	async up(db, client) {
		// users collection
		db.collection('users').createIndex(
			{
				email: 1,
			},
			{
				unique: true,
			},
		);

		// films collection
		db.collection('films').createIndex(
			{
				name: 1,
			},
			{
				unique: true,
			},
		);

		// reviews collection
		db.collection('reviews').createIndex({ filmId: 1 });
		db.collection('reviews').createIndex({ reviewerId: 1 });

		// genres collection
		db.collection('genres').createIndex(
			{
				name: 1,
			},
			{
				unique: true,
			},
		);
	},

	// removing indexes
	async down(db, client) {
		db.collection('users').dropIndex({
			email: 1,
		});

		db.collection('films').dropIndex({
			name: 1,
		});

		db.collection('reviews').dropIndex({ filmId: 1 });
		db.collection('reviews').dropIndex({ reviewerId: 1 });

		db.collection('genres').dropIndex({
			name: 1,
		});
	},
};
