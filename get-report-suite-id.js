'use strict';

var system = require('system'),
    webpage = require('webpage').create,
    page = webpage();

if (!system.args[1]) {
    console.log('Usage: %s url [mobile]', system.args[0]);
    phantom.exit(1);
}

var url = system.args[1],
    mobile = system.args[2];

if (mobile) {
    // http://whatsmyuseragent.com/Devices/iPhone-User-Agent-Strings
    page.settings.userAgent = 'Mozilla/5.0(iPhone;U;CPUiPhoneOS4_0likeMacOSX;en-us)AppleWebKit/532.9(KHTML,likeGecko)Version/4.0.5Mobile/8A293Safari/6531.22.7';
}

page.onError = function () {};

page.open(url);

page.onLoadFinished = function () {
    setTimeout(function () {
        var report_suite_id = page.evaluate(function () {
            var report_suite_matcher = /https?:\/\/.+?\/b\/ss\/(.+?)\//,
                report_suite_url,
                variable;

            for (variable in window) {
                // TODO check
                if (variable.indexOf('s_i_') === 0 && window[variable].src) {
                    report_suite_url = window[variable].src.match(report_suite_matcher);

                    if (report_suite_url) {
                        return report_suite_url;
                    }
                }
            }
        });

        if (report_suite_id && report_suite_id[1]) {
            console.log(report_suite_id[1]);
        } else {
            console.log('NOT-FOUND');
        }

        phantom.exit();
    }, 5000);
};

setTimeout(phantom.exit, 60000);
