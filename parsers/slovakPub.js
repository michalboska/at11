var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');

module.exports.parse = function(html, date, callback) {
    const DATE_REGEX = /(\d{1,2}) ?\. ?(\d{1,2})\.? ?/i;

    var $ = cheerio.load(html);

    //Meals are quite unstructured, so we need to load everything div-by-div and implement a simple "state machine"
    //we simply parse everything, ignoring entries that are for different dates than today
    var rootElem = $('.item-page');
    var day = undefined,
        month = undefined,
        isFirstLine = false,
        meals = [];
    var todayDay = date.format('D'),
        todayMonth = date.format('M');

    rootElem.children('p').each(function () {
        var elem = $(this).text().trim();
        if (DATE_REGEX.test(elem)) { //a new section for a new date is starting
            var dateParsed = DATE_REGEX.exec(elem);
            day = dateParsed[1];
            month = dateParsed[2];
            isFirstLine = true; //next line will be the first meal (soup) for this date
        } else if (day === todayDay && month === todayMonth) { //we only want today's meals
            meals.push({
                isSoup: isFirstLine,
                text: elem,
                price: 0
            });
            isFirstLine = false;
        }
    });

    callback(meals);
};