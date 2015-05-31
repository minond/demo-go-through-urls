'use strict';

var system = require('system'),
    webpage = require('webpage').create,
    page = webpage();

if (!system.args[1]) {
    console.log('Usage: %s url [device_type]', system.args[0]);
    phantom.exit(1);
}

var url = system.args[1],
    device_type = system.args[2];

// http://whatsmyuseragent.com/Devices/iPhone-User-Agent-Strings
var user_agents = {
    'iphone': 'Mozilla/5.0(iPhone;U;CPUiPhoneOS4_0likeMacOSX;en-us)AppleWebKit/532.9(KHTML,likeGecko)Version/4.0.5Mobile/8A293Safari/6531.22.7',
    'ipad': 'Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10'
};

if (device_type in user_agents) {
    page.settings.userAgent = user_agents[device_type];
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
