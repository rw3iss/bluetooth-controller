const path = require('path');

// This plugin replaces all {ENV} variables in the src/index.html file,  with their values and produces an index.html file.
module.exports = {
    name: 'transform',
    setup(build) {
        let fs = require('fs');

        const opts = build.initialOptions;
        const define = build.initialOptions.define || {};
        //const appdir = path.resolve('./');
        const inputdir = path.dirname(path.resolve(opts.entryPoints[0] || './src'));
        const outfile = opts.outfile;
        const outdir = opts.outdir || (outfile ? path.resolve(path.dirname(outfile)) : path.resolve('../'));

        const cacheControl = (process.env.DISABLE_CACHE == 'true') ? '<META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE"><META HTTP-EQUIV="PRAGMA" CONTENT="NO-CACHE"><meta http-equiv="expires" content="0" />' : '';

        build.onResolve({ filter: /.*\.html$/ }, (args) => {
            const path1 = args.resolveDir.replace('/build', '');
            //console.log(`resolve:`, args.resolveDir, args, path1, path.join(path1, args.path));
            return { path: path.join(path1, args.path) };
        });

        const tryWriteIndex = async (inputdir, outdir) => {
            try {
                const indexFile = path.join(inputdir.trim(), 'index.html');
                if (!fs.existsSync(indexFile)) console.log(`Warning: index.html file not found at: ${indexFile}`);

                let text = await fs.promises.readFile(indexFile, 'utf8');
                text = text.replace(/{TIMESTAMP}/g, Date.now());
                text = text.replace('{CACHE_CONTROL}', cacheControl);

                // replace environment variables
                Object.keys(opts.define).forEach(k => {
                    var replace = `{${k}}`;
                    var re = new RegExp(replace, "g");
                    text = text.replace(re, opts.define[k]);
                });

                let outFile = path.resolve(outdir, 'index.html');
                fs.writeFileSync(outFile, text, { encoding: 'utf-8' });
                console.log('wrote', outFile);
            } catch (e) {
                console.log(`Exception transforming index.html file:`, e);
                throw e;
            }
        };

        tryWriteIndex(inputdir, outdir);

        build.onLoad({ filter: /.*\.html$/ }, async (args) => {
            let text = await fs.promises.readFile(args.path, 'utf8');
            text = text.replace(/{TIMESTAMP}/g, Date.now());
            text = text.replace('{CACHE_CONTROL}', cacheControl);

            // replace {ENV} variables in index file:
            Object.keys(define).forEach(k => {
                var replace = `{${k}}`;
                var re = new RegExp(replace, "g");
                text = text.replace(re, opts.define[k]);
            });

            let outFile = path.resolve(outdir, 'index.html');
            fs.writeFileSync(outFile, text, { encoding: 'utf-8' });

            return {
                contents: text,
                loader: 'text',
            };
        });

    },
};