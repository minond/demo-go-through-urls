'use strict';

var fs = require('fs'),
    debug = require('debug'),
    exec = require('child_process').exec;

if (!process.argv[2]) {
    console.log('Usage: %s urls_file', process.argv.join(' '));
    process.exit(1);
}

var urls_file = process.argv[2],
    reading = fs.createReadStream(urls_file);

var report_file = process.argv[3] || 'out.txt',
    writing = fs.createWriteStream(report_file);

var req_count = 0,
    req_completed = 0;

var log_status = debug('status'),
    log_report = debug('report');

function write(line) {
    log_report(line);
    writing.write(line + '\n');
}

function stat() {
    log_status('completed %s out of %s', req_completed, req_count);
}

writing.once('open', function () {
    reading.on('data', function (data) {
        var urls = data.toString().trim().split('\n');
        req_count += urls.length * 2;

        urls.forEach(function (url) {
            exec('./node_modules/.bin/phantomjs --ignore-ssl-errors=yes get-report-suite-id.js ' + url, function (err, stdout, stderr) {
                req_completed++;

                if (err) {
                    console.error('Error requesting %s (%s)', url, stderr.trim());
                    return;
                }

                write(url + ' (desktop):\t' + stdout.trim());
                stat();
            });

            exec('./node_modules/.bin/phantomjs --ignore-ssl-errors=yes get-report-suite-id.js ' + url + ' 1', function (err, stdout, stderr) {
                req_completed++;

                if (err) {
                    console.error('Error requesting %s (%s)', url, stderr.trim());
                    return;
                }

                write(url + ' (mobile):\t' + stdout.trim());
                stat();
            });
        });
    });
});
