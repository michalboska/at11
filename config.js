module.exports = {
	port: process.env.VCAP_APP_PORT || process.env.PORT || 8000,
	cacheExpiration: 2 * 60 * 60 * 1000, //2h
	parserTimeout: 20 * 1000, //20s
	restaurants: [
	{ id: 0, name: 'Jedáleň u Daňováka II', url: 'https://www.zomato.com/sk/bratislava/jed%C3%A1le%C5%88-u-da%C5%88ov%C3%A1ka-2-petr%C5%BEalka-bratislava-v/menu#tabtop', module: 'zomato' },
	{ id: 1, name: 'Street 54', url: 'http://www.street54.sk/lunch-time/#menu', module: 'street54' }

	],
	themes: {
		'jano': { name: 'Jano', template: '../views/index.html' },
		'matus': { name: 'Matúš', template: '../views/index3.html' },
		'iveta': { name: 'Iveta', template: '../views/index4.html' },
		'telka': { name: 'Telka', template: '../views/index5.html' }
	}
};
