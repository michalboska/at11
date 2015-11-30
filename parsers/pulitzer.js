var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');

module.exports.parse = function(html, date, callback) {
    const DATE_REGEX = /^([^\s\\]+]?), ?(\d{1,2})\. ?([^\-]+) ?(\d{4})$/i;
    const ALERGENS_REGEX = /^(.+) ?\/([, 0-9]+)\/?$/i;
    const PRICE = 4.9; //price for daily menu is constant
    const DAYS_ARRAY = ['PONDELOK', 'UTOROK', 'STREDA', 'ŠTVRTOK', 'PIATOK'];
    const SOUP = 'polievka';

    var $ = cheerio.load(html);

    //Meals are quite unstructured, so we need to load everything div-by-div and implement a simple "state machine"
    //we simply parse everything, ignoring entries that are for different dates than today
    var rootSelector = '#phocamenu';
    var dayOfWeek = undefined,
        day = undefined,
        year = undefined,
        isSoup = false,
        meals = [];
    var todayDay = date.format('D'),
        todayDayOfWeek = DAYS_ARRAY[date.format('d') - 1];

    $(rootSelector + ' > div').each(function () {
        var elem = $(this).text().trim();
        if (DATE_REGEX.test(elem)) { //a new section for a new date is starting
            var dateParsed = DATE_REGEX.exec(elem);
            dayOfWeek = dateParsed[1];
            day = dateParsed[2];
            year = dateParsed[4];
        } else if (dayOfWeek && dayOfWeek.toLowerCase() === todayDayOfWeek.toLowerCase() && day === todayDay) { //we only want today's meals
            if ($(this).hasClass('pm-group')) {
                isSoup = elem.toLowerCase() === SOUP;
            } else if ($(this).hasClass('pm-item')) {
                $(this).find('td.pmtitle').each(function () {
                    // $this is the TD in this function
                    var foodLabel = $(this).text();
                    var foodMatch = ALERGENS_REGEX.exec(foodLabel);
                    var foodText = (foodMatch) ? foodMatch[1].normalizeWhitespace() : foodLabel.normalizeWhitespace();
                    meals.push({
                        isSoup: isSoup,
                        text: foodText,
                        price: isSoup ? PRICE : 0
                    });
                });
            }
        }
    });

    callback(meals);
};