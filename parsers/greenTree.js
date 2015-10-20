var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');
var _ = require('lodash');

module.exports.parse = function(html, date, callback) {

    const DATE_REGEX = /(\d{1,2})\. ?(\d{1,2})\. ?(\d{4})/i;
    const ALERGENS_REGEX = /\(?[\d\,\-]+?\)?/ig;
    const IGNORE_PATTERN = 'obilniny';
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
    todaysMenuElem.find('.jedlo_polozka').each(function () {
        var foodElem = $(this);
        var foodName = foodElem.find('.left').text();
        var foodPrice = foodElem.find('.right').text();
        if (foodName.indexOf(IGNORE_PATTERN) > -1) {
            return true;
        }
        meals.push({
            isSoup: foodName.toLowerCase().indexOf(SOUP) > -1,
            text: foodName.normalizeWhitespace().replace(ALERGENS_REGEX, ''),
            price: parserUtil.parsePrice(foodPrice).price
        });
    });

    callback(meals);
};