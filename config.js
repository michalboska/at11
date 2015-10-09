module.exports = {
	port: process.env.VCAP_APP_PORT || process.env.PORT || 8000,
	cacheExpiration: 2 * 60 * 60 * 1000, //2h
	parserTimeout: 20 * 1000, //20s
	keepaliveHost: 'http://at11.herokuapp.com/',
	keepalivePeriod: 15 * 60 * 1000,
	restaurants: [
	{ id: 0, name: 'Papaya', url: 'http://papayavn.eu/index.php?page=menuTyzdenne', module: 'papaya' },
	{ id: 1, name: 'Street 54', url: 'http://www.street54.sk/lunch-time/#menu', module: 'street54' },
	{ id: 2, name: 'Slovak Pub', url: 'http://www.slovakpub.sk/index.php/denne-menu', module: 'slovakPub' }

	],
	themes: {
		'jano': { name: 'Jano', template: '../views/index.html' },
		'matus': { name: 'Matúš', template: '../views/index3.html' },
		'iveta': { name: 'Iveta', template: '../views/index4.html' },
		'telka': { name: 'Telka', template: '../views/index5.html' }
	}
};
