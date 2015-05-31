'use strict';

if (!process.argv[2]) {
    console.log('Usage: %s urls_file', process.argv.join(' '));
    process.exit(1);
}

var cmd_get_report_suite = './node_modules/.bin/phantomjs --ignore-ssl-errors=yes get-report-suite-id.js ',
    out_try_again = 'NOT-FOUND';

var MemoryWorker = require('./memory-worker'),
    worker = new MemoryWorker(10);

var fs = require('fs'),
    debug = require('debug'),
    exec = require('child_process').exec;

var urls_file = process.argv[2],
    reading = fs.createReadStream(urls_file);

var report_file = process.argv[3] || 'out.txt',
    writing = fs.createWriteStream(report_file);

var req_count = 0,
    req_completed = 0;

var log_status = debug('status'),
    log_retry = debug('retry'),
    log_report = debug('report');

function write(line) {
    log_report(line);
    writing.write(line + '\n');
}

function stat() {
    log_status('completed %s out of %s', req_completed, req_count);
}

function get_report_suite(url, mobile, label, done) {
    mobile = mobile ? ' 1' : '';

    (function get_report_suite_id() {
        exec(cmd_get_report_suite + url + mobile, function (err, stdout, stderr) {
            req_completed++;

            if (err) {
                console.error('Error requesting %s (%s)', url, stderr.trim());
                return;
            }

            stdout = stdout.trim();
            if (stdout === out_try_again && !get_report_suite_id.force) {
                req_completed--;
                log_retry('checking %s again', url);
                get_report_suite_id.force = true;
                get_report_suite_id();
            } else {
                write(url + ' ' + label + ':\t' + stdout);
                stat();
                done();
            }
        });
    })();
}

writing.once('open', function () {
    reading.on('data', function (data) {
        var urls = data.toString().trim().split('\n');
        req_count += urls.length * 2;

        urls.forEach(function (url) {
            worker.run(function (done) {
                get_report_suite(url, false, '(desktop)', done);
            });

            worker.run(function (done) {
                get_report_suite(url, true, '(mobile)', done);
            });
        });
    });
});
