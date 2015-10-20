var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');
var _ = require('lodash');

module.exports.parse = function(html, date, callback) {

    const DATE_REGEX = /(\d{1,2})\. ?(\d{1,2})\. ?(\d{4})/i;
    const PRICE_REGEX = /cena:? ?(.+)/ig;
    const SOUP = 'polievka';

    var $ = cheerio.load(html);

    var todaysMenuElem = $('#main');
    var dateText = todaysMenuElem.find('h2.title').text();

    var dateMatch = DATE_REGEX.exec(dateText);
    if (!dateMatch) {
        throw new Error('Could not find section for the specified date');
    }

    if ((date.format('DD') != dateMatch[1]) || (date.format('MM') != dateMatch[2]) || (date.format('YYYY') != dateMatch[3])) {
        throw new Error('The today\'s section is for different date');
    }

    var meals = [];
    var price;
    todaysMenuElem.find('.line').each(function () {
        var foodElem = $(this);
        var foodType = foodElem.find('.left').text().normalizeWhitespace();
        var foodName = foodElem.find('.right').text().normalizeWhitespace().removeItemNumbering().trim();

        if (!foodName) {
            return true;
        }

        var priceMatch = PRICE_REGEX.exec(foodName);
        if (priceMatch) {
            foodName = foodName.replace(PRICE_REGEX, '').trim();
            price = parserUtil.parsePrice(priceMatch[1]).price;
        }
        var isSoup = foodType.toLowerCase().indexOf(SOUP) > -1;
        meals.push({
            isSoup: isSoup,
            text: foodName.normalizeWhitespace(),
            price: isSoup ? 0 : price
        });
    });

    callback(meals);
};