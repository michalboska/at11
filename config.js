module.exports = {
	port: process.env.VCAP_APP_PORT || process.env.PORT || 8000,
	cacheExpiration: 2 * 60 * 60 * 1000, //2h
	parserTimeout: 20 * 1000, //20s
	keepaliveHost: 'http://at11.herokuapp.com/',
	keepalivePeriod: 15 * 60 * 1000, //15 mins
	restaurants: [
	{ id: 0, name: 'Papaya', url: 'http://papayavn.eu/index.php?page=menuTyzdenne', module: 'papaya' },
	{ id: 1, name: 'Street 54', url: 'http://www.street54.sk/#dennemenu', module: 'street54' },
	{ id: 2, name: 'Slovak Pub', url: 'http://www.slovakpub.sk/index.php/denne-menu', module: 'slovakPub' },
	{ id: 3, name: 'U zeleného stromu', url: 'http://uzelenehostromu.sk/', module: 'greenTree' },
	{ id: 4, name: 'Le Petit cafe', url: 'https://www.zomato.com/sk/bratislava/le-petit-cafe-restaurant-star%C3%A9-mesto-bratislava-i/menu', module: 'zomato' },
	{ id: 5, name: 'Olive Tree', url: 'https://www.zomato.com/sk/bratislava/olive-tree-star%C3%A9-mesto-bratislava-i/menu', module: 'zomato2' },
	{ id: 6, name: 'Pulitzer u zlatého jeleňa', url: 'http://www.pulitzeruzlatehojelena.sk/menu/dnesne-obedove-menu', module: 'pulitzer' },
	{ id: 7, name: 'City Vegetarian', url: 'http://restauracie.sme.sk/restauracia/city-vegetarian_625-bratislava_2983/denne-menu', module: 'sme' }


	],
	themes: {
		'jano': { name: 'Jano', template: '../views/index.html' },
		'matus': { name: 'Matúš', template: '../views/index3.html' },
		'iveta': { name: 'Iveta', template: '../views/index4.html' },
		'telka': { name: 'Telka', template: '../views/index5.html' }
	}
};
