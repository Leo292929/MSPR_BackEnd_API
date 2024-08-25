const logger = {
    info: (msg) => {
        console.log(`Info: ${msg}`);
    },
    warn: (msg) => {
        console.warn(`Warn: ${msg}`);
    },
    error: (msg) => {
        console.error(`Error: ${msg}`);
    }
};

module.exports = logger;