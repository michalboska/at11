var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');
var request = require('request');
var moment = require('moment-timezone');
var _ = require('lodash');

module.exports.parse = function(html, date, callback) {
    const SOUP_REGEX = /polievka/i;
    const PRICE_REGEX = /cena ?: ?([0-9,\.]+) ?EUR/i;
    const DAYS_ARRAY = ['PONDELOK', 'UTOROK', 'STREDA', 'ŠTVRTOK', 'PIATOK'];

    var $ = cheerio.load(html);

    //get DIV for current day
    var daysElems = $('#food-container .frameMenuTyzdenne');
    var curDayElem = daysElems.filter(function () {
        var elemText = $(this).find('.category').text().trim();
        var today = DAYS_ARRAY[moment().format('d') - 1];
        return elemText === (today + ' :');
    })[0];
    if (!curDayElem) {
        return callback(new Error('No such element'));
    }

    var meals = [];

    //load all meals at once. We decide, if a meal is soup, by matching the name against a predefined word
    //Also, price is defined as a special element, so we need to read all elements first and then see which one defines a price
    var price = 0;
    $(curDayElem).find('.item').each(function () {
        var text = $(this).text().trim();
        var isPrice = PRICE_REGEX.test(text);
        if (isPrice) {
            price = parseFloat(PRICE_REGEX.exec(text)[1].replace(',', '.'));
        } else {
            var isSoup = SOUP_REGEX.test(text);
            meals.push({
                isSoup: isSoup,
                text: text,
                price: undefined //TBD later, when we parse the Price element
            });
        }
    });

    //now traverse the meals array, setting the actual price
    meals = _.map(meals, function (meal) {
        meal.price = meal.isSoup ? price : 0;
        return meal;
    });

    callback(meals);
};