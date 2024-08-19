/*
File: timer.js
Description:
    timer class used for the metronome in tools.js
*/

class Timer {
    constructor(callback, timeInterval, options) {
        this.timeInterval = timeInterval;

        this.start = () => {
            /* Start timer */
            this.expected = Date.now() + this.timeInterval;
            this.theTimeout = null; // start timeout & save id to cancel it later
            if (options.immediate) {
                callback();
            }
            this.timeout = setTimeout(this.round, this.timeInterval);
            // console.log('Timer Started');
        };

        this.stop = () => {
            /* End timer */
            clearTimeout(this.timeout);
            // console.log('Timer Stopped');
        };

        this.round = () => {
            /* Runs the callback and adjusts the time */
            // console.log('timeout', this.timeout);
            let drift = Date.now() - this.expected;
            if (drift > this.timeInterval) {
                // Run error callback
                if (options.errorCallback) {
                    options.errorCallback();
                }
            }
            callback();

            // Increment expected time every round after running callback
            this.expected += this.timeInterval;
            // console.log('Drift:', drift);
            // console.log('Next round time interval:', this.timeInterval - drift);
            this.timeout = setTimeout(this.round, this.timeInterval - drift); // run timeout again
        };
    }
}

export default Timer;