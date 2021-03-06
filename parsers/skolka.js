var cheerio = require('cheerio');
var parserUtil = require('./parserUtil');
var request = require('request');

module.exports.parse = function(html, date, callback) {
    var $ = cheerio.load(html);

    var dateReg = new RegExp("^\\s*0?" + date.date() + "\\.\\s*0?" + (date.month() + 1) + "\\.\\s*" + date.year());
    var todayNameReg = new RegExp("^\\s*" + date.format("dddd"), "i");
    
    var pic = $('.entry-content img');
    var link = $('.entry-content a').filter(function() {
        return $(this).text() !== '' && !/<a/.test($(this).html());
    });

    if (pic.length === 0 && link.length > 0) {
        var pdfUrl = link.attr('href');
        callOcr(pdfUrl, 'pdf');
    }
    else if (pic.parent().filter("a").length > 0) {
        pic = pic.parent().attr('href');
        callOcr(pic, "url");
    }
    else if (pic.attr('src') !== undefined) {
        pic = pic.attr('src');
        callOcr(pic, "encoded");
    } else {
        parseMenu($('div.entry-content', '#post-2').text());
    }

    function callOcr(picData, actionMetod) {
        request.post({
            headers: { 'Content-type': 'application/x-www-form-urlencoded' },
            url: 'http://at11ocr.azurewebsites.net/api/process/' + actionMetod,
            body: "=" + encodeURIComponent(picData)
        }, function(error, response, body) {
            if (!error) {
                parseMenu(body);
            }
            callback([]);
        });
    }

    function parseMenu(menuString) {
        var lines = menuString.split("\n").filter(function(val) {
            return val.trim();
        });

        var dayMenu = [];
        var price;
        for (var i = 0; i < lines.length; i++) {
            if (todayNameReg.test(lines[i])) {
                for (var offset = 0; offset < 3; offset++)//3 menu lines each day
                {
                    var txt = lines[i + offset];
                    if (offset === 0) {
                        txt = txt.replace(todayNameReg, "");
                    }
                    if (offset === 1) {
                        txt = txt.replace(dateReg, "");
                    }
                    txt = normalize(txt);
                    if (txt) {
                        dayMenu.push(txt);
                    }
                }
            }
            if (/Hodnota stravy/.test(lines[i])) {
                price = parserUtil.parsePrice(lines[i]).price;
            }
            else {
                price = price || NaN;
            }
        }

        //convert to menu item object
        dayMenu = dayMenu.map(function(item, index) {
            return { isSoup: /polievka/i.test(item), text: item, price: index === 0 ? NaN : price };
        });
        callback(dayMenu);
    }

    function normalize(str) {
        return str.tidyAfterOCR()
                .removeItemNumbering()
                .removeMetrics()
                .normalizeWhitespace()
                .correctCommaSpacing();
    }
};
