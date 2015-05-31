'use strict';

function MemoryWorker(limit) {
    this.limit = limit;
    this.in_progress = 0;
    this.queue = [];
}

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
