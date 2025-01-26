const path = require("path");
const { rimraf } = require('rimraf');

async function cleanAndRun(OUTPUT_DIR, fn) {
    try {
        await clean(OUTPUT_DIR);
        fn();
    } catch (e) {
        console.log(`cleanAndRun error:`, e)
    }
}

async function clean(dir) {
    try {
        if (!dir) throw `${dir} does not given for clean.`;
        await rimraf(dir)
    } catch (e) {
        throw e;
    }
}

module.exports = {
    cleanAndRun,
    clean
}