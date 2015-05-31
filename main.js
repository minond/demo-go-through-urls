'use strict';

var webpage = require('webpage'),
    page = webpage.create();

// page.settings.userAgent = '';

page.open('https://www.google.com/', function (status) {
    var title = page.evaluate(function () {
        return document.title;
    })
    // console.log([].splice.call(arguments, 0))
    console.log(title);
    phantom.exit();
});
