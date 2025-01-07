const path = require('path');

// todo: integrate somehow
const OUTPUT_DIR = './build';

// copyPlugin.ts
// Copy some stuff, anything, after build, if needed.
module.exports = {
    name: 'copy',
    setup(build) {
        const fse = require('fs-extra');

        // copy static folder to build.
        try {
            let indexHtml = path.resolve(`./index.html`);
            if (fse.existsSync(indexHtml)) {
                fse.copySync(indexHtml, path.resolve(`${OUTPUT_DIR}/index.html`), { overwrite: true }, (err) => {
                    if (err) throw err;
                });
            } else {
                console.log(`copyPlugin: index.html doesnt exist`);
            }

            let assetDir = 'public';
            let assetPath = path.resolve(`./${assetDir}`);
            if (fse.existsSync(assetPath)) {
                fse.copySync(assetPath, path.resolve(`${OUTPUT_DIR}/${assetDir}`), { overwrite: true }, (err) => {
                    if (err) throw err;
                });
                //fse.copySync(path.resolve('./static/favicon.ico'), path.resolve(`${OUTPUT_DIR}/favicon.ico`), { overwrite: true });
            } else {
                console.log(`copyPlugin: public dir doesnt exist`)
            }
        } catch (e) {
            console.error('error: ', e);
        }
    }
};
