var cheerio = require('cheerio');
require('./parserUtil');

module.exports.parse = function(html, date, callback) {

    const SOUP_REGEX = /(polievka)|(v.var)/i;
    const IGNORE_REGEX = /(objednajte)|(obchodn.)|(www\.)|(\.sk)/i;

    var $ = cheerio.load(html);
    var dayMenu = [];

    $('#daily-menu-container').find('.tmi-group').each(function() {
        var $this = $(this);

        var text = $this.children('.tmi-group-name').text();
        var day = getDay(text);

        if(day === date.format('dddd')){
            $this.children('.tmi-daily').each(function() {
                var text = $(this).find('.tmi-name').text().trim();

                //if this is some promo text, not an actual food, skip this line
                if (IGNORE_REGEX.test(text)) {
                    return true;
                }
                var price = parseFloat($(this).find('.tmi-price').text().replace(/,/, '.'));
                if(isNaN(price)){//price probably directly in text, extract it
                    text = text.replace(/\d[\.,]\d{2}$/, function(match){
                        price = parseFloat(match.replace(',', '.'));
                        return '';
                    });
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
