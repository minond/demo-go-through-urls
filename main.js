'use strict';

var system = require('system'),
    webpage = require('webpage').create,
    page = webpage();

var url = system.args[1],
    mobile = system.args[2];

if (mobile) {
    page.settings.userAgent = 'Mozilla/5.0(iPhone;U;CPUiPhoneOS4_0likeMacOSX;en-us)AppleWebKit/532.9(KHTML,likeGecko)Version/4.0.5Mobile/8A293Safari/6531.22.7';
}

page.open(url, function (status) {
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
