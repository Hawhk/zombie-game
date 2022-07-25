class Timer {
    constructor(callback, delay) {
        this.callback = callback;
        this.remaining = delay;
        this.timerId = null;
        this.start;

        this.resume();
    }

    pause () {
        clearTimeout(this.timerId);
        this.timerId = null;
        this.remaining -= Date.now() - this.start;
    };

    resume () {
        if (this.timerId) {
            return;
        }

        this.start = Date.now();
        this.timerId = setTimeout(this.callback, this.remaining);
    };
};