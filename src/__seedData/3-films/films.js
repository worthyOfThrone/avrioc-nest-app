const Films = [
	{
		_id: '62db113f308a7af4d8cb4f48',
		name: 'Man vs Bee',
		description: 'comedy movie by Mr. Bean',
		releaseDate: new Date('6/8/2012'),
		country: 'US',
		reviews: [
			'62e0554831096dde4b13b286',
			'62e0559cd7c5b1e624993294',
		],
		genres: [
			'62dac703b516ee008c34017c', 
			'62dac8bb62e1ad02d28f6f55', 
		],
		createdAt: new Date(),
		updatedAt: new Date(),
		rating: 4.25,
	},
	{
		_id: '62db1451de21bf2dc47c34b8',
		name: 'Tarzen',
		description: 'fantastic comedy action movie',
		releaseDate: new Date('6/18/2019'),
		country: 'IN',
		reviews: [],
		genres: [
			'62dac8bb62e1ad02d28f6f55', 
			'62dac703b516ee008c34017c', 
			'62dc7418bd00eec53ab16a16',
		],
		createdAt: new Date(),
		updatedAt: new Date(),
		rating: 3.75,
	},
	{
		_id: '62db16a2170bb80be61c20b1',
		name: 'Kung Fu Panda 3',
		description: 'animated moview-comedy and action',
		releaseDate: new Date('6/7/2022'),
		country: 'CH',
		reviews: [],
		genres: [
			'62dac8bb62e1ad02d28f6f55', 
			'62dac703b516ee008c34017c', 
			'62dac9f11f2511ccb354da4a',
		],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

module.exports = Films;
