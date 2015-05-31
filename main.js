'use strict';

var fs = require('fs'),
    exec = require('child_process').exec;

if (!process.argv[2]) {
    console.log('Usage: %s urls_file', process.argv.join(' '));
    process.exit(1);
}

var urls_file = process.argv[2],
    reading = fs.createReadStream(urls_file);

var report_file = process.argv[3] || 'out.txt',
    writing = fs.createWriteStream(report_file);

writing.once('open', function () {
    reading.on('data', function (data) {
        var urls = data.toString().trim().split('\n');

        urls.forEach(function (url) {
            exec('phantomjs --ignore-ssl-errors=yes get-report-suite-id.js ' + url, function (err, stdout, stderr) {
                if (err) {
                    console.error('Error requesting %s', url);
                    return;
                }

                console.log('%s (desktop):\t%s', url, stdout.trim());
                writing.write(url + ' (desktop):\t' + stdout.trim() + '\n');
            });

            exec('phantomjs --ignore-ssl-errors=yes get-report-suite-id.js ' + url + ' 1', function (err, stdout, stderr) {
                if (err) {
                    console.error('Error requesting %s', url);
                    return;
                }

                console.log('%s (mobile):\t%s', url, stdout.trim());
                writing.write(url + ' (mobile):\t' + stdout.trim() + '\n');
            });
        });
    });
});
