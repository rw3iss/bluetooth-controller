const path = require('path');

const OUTPUT_DIR = './build';
const ASSET_DIR = 'public';

/**
  * esbuil Copy plugin:
  * Copies general site static assets, if they exist (ie. index page, service worker files, favicon, etc)
  *
  * Todo: integrate esbuild config output dir, and list of files to copy.
*/

module.exports = {
    name: 'copy',
    setup(build) {
        const fse = require('fs-extra');

        // todo: pull in the files to copy from some config....

        try {
            // copy index.html
            let index = path.resolve(`./index.html`);
            if (fse.existsSync(index)) {
                fse.copySync(index, path.resolve(`${OUTPUT_DIR}/index.html`), { overwrite: true }, (err) => {
                    if (err) throw err;
                });
            } else {
                console.log(`copyPlugin: index.html doesnt exist`);
            }

            // copy SW and manifest
            let sw = path.resolve(`./src/sw.js`);
            let mf = path.resolve(`./manifest.json`);
            if (fse.existsSync(sw)) {
                fse.copySync(sw, path.resolve(`${OUTPUT_DIR}/sw.js`), { overwrite: true }, (err) => { if (err) throw err; });
            }
            if (fse.existsSync(mf)) {
                fse.copySync(mf, path.resolve(`${OUTPUT_DIR}/manifest.json`), { overwrite: true }, (err) => { if (err) throw err; });
            }

            // copy favicon
            let fi = path.resolve(`./favicon.ico`);
            if (fse.existsSync(fi)) {
                fse.copySync(fi, path.resolve(`${OUTPUT_DIR}/favicon.ico`), { overwrite: true }, (err) => { if (err) throw err; });
            }

            // copy /public folder
            let assetPath = path.resolve(`./${ASSET_DIR}`);
            if (fse.existsSync(assetPath)) {
                fse.copySync(assetPath, path.resolve(`${OUTPUT_DIR}/${ASSET_DIR}`), { overwrite: true }, (err) => { if (err) throw err; });
            } else {
                console.log(`copyPlugin: public dir doesnt exist`)
            }
        } catch (e) {
            console.error('error: ', e);
        }
    }
};
