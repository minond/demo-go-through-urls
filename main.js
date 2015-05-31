'use strict';

var fs = require('fs'),
    exec = require('child_process').exec;

if (!process.argv[2]) {
    console.log('Usage: %s urls_file', process.argv.join(' '));
    process.exit(1);
}

var urls_file = process.argv[2],
    reading = fs.createReadStream(urls_file);

reading.on('data', function (data) {
    var urls = data.toString().trim().split('\n');

    urls.forEach(function (url) {
        exec('phantomjs --ignore-ssl-errors=yes get-report-suite-id.js ' + url, function (err, stdout, stderr) {
            if (err) {
                console.error('Error requesting %s', url);
                return;
            }

            console.log('%s: %s', url, stdout.trim());
        });

        exec('phantomjs --ignore-ssl-errors=yes get-report-suite-id.js ' + url + ' 1', function (err, stdout, stderr) {
            if (err) {
                console.error('Error requesting %s', url);
                return;
            }

            console.log('%s (mobile): %s', url, stdout.trim());
        });
    });
});
