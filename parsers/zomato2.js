var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, date, callback) {

    const SOUP_REGEX = /polievka/i;

    var $ = cheerio.load(html);
    var dayMenu = [];

    $('#daily-menu-container').find('.tmi-group').each(function() {
        var $this = $(this);

        var text = $this.children('.tmi-group-name').text();
        var day = getDay(text);

        if(day === date.format('dddd')){
            $this.children('.tmi-daily').each(function() {
                var text = $(this).find('.tmi-name').text().trim();
                var price = parseFloat($(this).find('.tmi-price').text().replace(/,/, '.'));
                if(isNaN(price)){//price probably directly in text, extract it
                    text = text.replace(/\d[\.,]\d{2}$/, function(match){
                        price = parseFloat(match.replace(',', '.'));
                        return '';
                    });
                }
                if (isNaN(price)) { //if price is still undefined, this is probably not food, only some additional info. Skip it
                    return false;
                }

                dayMenu.push({ isSoup: SOUP_REGEX.test(text), text: normalize(text), price: price });

            });
            return false;
        }
    });

    callback(dayMenu);

    function getDay(text) {
      var found = text.trim().match(/^(.+),/);
      if (!found || found.length < 1) {
        return null;
      }

      return found[1].toLowerCase();
    }

    function normalize(str) {
        return str.removeItemNumbering()
            .removeMetrics()
            .replace(/A\s(\d\s?[\.,]?\s?)+$/, '')
            .correctCommaSpacing()
            .normalizeWhitespace();
    }
};
