var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');
var request = require('request');
var moment = require('moment-timezone');
var _ = require('lodash');

module.exports.parse = function(html, date, callback) {

    var SLASH_SEPARATOR_REGEX = /([^\/]+)\/([^\/]+)/;

    var $ = cheerio.load(html);

    //get DIV for current day
    var daysElems = $('#menu-dni');
    var curDayElem = daysElems.filter(function () {
        var elemText = $(this).find('p.datum').text();
        var today = moment().format('D. M. YYYY');
        return elemText === today;
    })[0];
    if (!curDayElem) {
        return callback(new Error('No such element'));
    }

    var meals = [];

    //load soups
    $(curDayElem).find('.cela-polievka').each(function () {
        var soupName = $(this).find('.nazov-polievky').text();
        var slovakName = SLASH_SEPARATOR_REGEX.exec(soupName)[1].normalizeWhitespace();
        var volume = $(this).find('.objem-polievky').text();
        var price = parserUtil.parsePrice($(this).find('.cena-polievky').text());

        meals.push({
            isSoup: true,
            text: slovakName + ' (' + volume + ')',
            price: price.price
        });
    });

    //load main meals
    $(curDayElem).find('.cele-jedlo').each(function () {
        var mealName = $(this).find('.nazov-jedla').text();
        var slovakName = SLASH_SEPARATOR_REGEX.exec(mealName)[1].normalizeWhitespace();
        var volume = $(this).find('.vaha-jedla').text();
        var price = parserUtil.parsePrice($(this).find('.cena-jedla').text());

        meals.push({
            isSoup: false,
            text: slovakName + ' (' + volume + ')',
            price: price.price
        });
    });

    callback(meals);

};