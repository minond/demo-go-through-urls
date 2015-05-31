'use strict';

/**
 * @usage
 *   var jobs = new MemoryWorker(100);
 *
 *   var i = 100;
 *   while (i--) {
 *       jobs.run(function (done) {
 *           setTimeout(function () {
 *               console.log(new Date);
 *               done();
 *           }, 1000);
 *       });
 *   }
 *
 * @class MemoryWorker
 * @param {Number} worker limit
 */
function MemoryWorker(limit) {
    this.limit = limit;
    this.in_progress = 0;
    this.queue = [];
}

/**
 * queue a function
 * @param {Function} action
 */
MemoryWorker.prototype.run = function (action) {
    this.queue.push(action);
    this.tick();
};

MemoryWorker.prototype.tick = function () {
    var action;

    if (this.in_progress < this.limit && this.queue.length) {
        this.in_progress++;
        action = this.queue.shift();
        action(MemoryWorker.done.bind(this));
    }
};

MemoryWorker.done = function () {
    this.in_progress--;
    this.tick();
};

module.exports = MemoryWorker;
