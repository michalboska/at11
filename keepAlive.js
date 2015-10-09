var request = require('request');

exports = module.exports = function (hostname, timeout) {
    var interval;

    if (!hostname || !timeout) {
        return;
    }

    console.log('Setting up keepalive to run each ' + (timeout / 1000) + ' seconds against host ' + hostname);

    interval = setInterval(function () {
        request(hostname, function (error, response) {
            if (error || response.statusCode != 200) {
                console.warn('Keepalive request failed with status ' + response.statusCode + ': ' + error);
            }
        });
    }, timeout);
};

