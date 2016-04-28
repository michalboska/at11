var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');

module.exports.parse = function (html, date, callback) {

    const SLASH_SEPARATOR_REGEX = /([^\/]+)\/([^\/]+)/;

    var $ = cheerio.load(html);

    //get DIV for current day
    var daysElems = $('.ppb_wrapper .one');
    var curDayElem = daysElems.filter(function () {
        var elemText = $(this).find('h5.menu_post span.menu_title').text();
        var today = date.format('D.M.YYYY');
        var idx = elemText.indexOf(today);
        return idx > -1;
    })[0];
    if (!curDayElem) {
        return callback(new Error('No such element'));
    }

    var meals = [];
    var soups = false;

    $(curDayElem).find('.menu_content_classic').each(function () {
        var foodTitle = $(this).find('.menu_title').text().normalizeWhitespace();
        if (foodTitle.toLowerCase() === 'polievky') {
            soups = true;
            return;
        }
        if (foodTitle.toLowerCase() === 'hlavné jedlá') {
            soups = false;
            return;
        }
        var price = $(this).find('.menu_price').text();
        if (!price) {
            return;
        }
        price = price.replace('€', '');
        price = price.replace(',', '.');
        var item = {
            isSoup: soups,
            text: foodTitle,
            price: parseFloat(price)
        };
        meals.push(item);
    });

    callback(meals);

};