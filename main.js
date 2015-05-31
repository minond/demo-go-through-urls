'use strict';

var webpage = require('webpage').create,
    page = webpage();

// page.settings.userAgent = '';

page.open('http://www.walmart.com/', function (status) {
    setTimeout(function () {
        var report_suite_id = page.evaluate(function () {
            var report_suite_matcher = /https?:\/\/.+?\/b\/ss\/(.+?)\//,
                report_suite_url,
                variable;

            for (variable in window) {
                if (variable.indexOf('s_i_') === 0 && window[variable].src) {
                    report_suite_url = window[variable].src.match(report_suite_matcher);

                    if (report_suite_url) {
                        return report_suite_url;
                    }
                }
            }
        });

        console.log(report_suite_id[1]);
        phantom.exit();
    }, 1000);
});
