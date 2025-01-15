
const fs = require("fs");
const path = require("path");
const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
//const postCssPlugin = require("esbuild-plugin-postcss2");
//const autoprefixer = require("autoprefixer");
const { getNormalizedEnvVars } = require("./utils/envUtils");
const { mkDirSync } = require("./utils/fileUtils");
const dotenv = require('dotenv');
//const postcss = require("postcss");
//const postcssPresetEnv = require("postcss-preset-env");
//const sassPlugin = require("esbuild-plugin-sass");
const { sassPlugin } = require('esbuild-sass-plugin');
const scssPlugin = require('./plugins/scssPlugin.ts');
const transformHtmlTemplatePlugin = require("./plugins/transformHtmlTemplatePlugin.ts");
const copyPlugin = require("./plugins/copyPlugin.ts");
const { createServer } = require("http");
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
//const gzipPlugin = require('@luncheon/esbuild-plugin-gzip');

// Config params (relative to where npm/script is called from):
const GLOBAL_NAME = 'Bluetooth';
const INPUT_DIR = './src';
const OUTPUT_DIR = './build';
const TARGET = 'esnext';

const IS_DEV = process.env.NODE_ENV != 'production';
const WATCH = process.argv[process.argv.length - 1] == '--watch';

const NODE_ENV = (process.env.NODE_ENV || 'local');
dotenv.config({ path: `.env.${NODE_ENV}` });
const { define, defineNoQuotes } = getNormalizedEnvVars();

console.log('build.js node environment detected as: ' + NODE_ENV);
///////////////////////////////////////////////////////////////////////////////

const pluginCache = new Map();
const CWD = path.resolve('./');

const clients = [];

const liveReload = {
    name: 'liveReload',
    setup: (build) => {
        build.onEnd(result => {
            clients.forEach((res) => res.write("data: update\n\n"));
            clients.length = 0;
        });
    }
};

// Main bundling function.
async function dev() {
    mkDirSync(OUTPUT_DIR);

    let ctx = await esbuild
        .context({
            platform: "browser",
            entryPoints: [
                `${INPUT_DIR}/index.tsx`,
                //`${INPUT_DIR}/styles/index.scss`
            ],
            //entryFile: `${INPUT_DIR}/index.tsx`,
            outfile: `${OUTPUT_DIR}/app.js`,
            bundle: true,
            format: "esm",
            jsxFactory: "h",
            inject: ["preact"],
            globalName: GLOBAL_NAME,
            loader: { // built-in loaders: js, jsx, ts, tsx, css, json, text, base64, dataurl, file, binary
                '.ttf': 'file',
                '.otf': 'file',
                '.woff': 'file',
                '.woff2': 'file',
                '.png': 'file',
                '.gif': 'file',
                '.jpg': 'file',
                '.svg': 'file',
                '.js': 'js',
                '.jsx': 'jsx',
                '.ts': 'ts',
                '.scss': 'file'
            },
            external: ['window', 'document'],
            assetNames: 'public/[name].[hash]',
            tsconfig: "tsconfig.json",
            mainFields: ["browser", "module", "main"],
            plugins: [
                sassPlugin({
                    cache: pluginCache,
                    loadPaths: [`${CWD}`],
                    filter: /\.scss$/,
                    async transform(source) {
                        const { css } = await postcss([autoprefixer]).process(source);
                        return css;
                    },
                    //type: 'lit-css'
                }),
                copyPlugin,
                {
                    name: 'rebuild-notify',
                    setup(build) {
                        build.onEnd(result => {
                            console.log(`build ended with ${result.errors.length} errors`);
                            // HERE: somehow restart the server from here, e.g., by sending a signal that you trap and react to inside the server.
                        })
                    }
                }
            ],
            //write: false, // necessary for gzipPlugin
            define: { ...define, global: "window" },
            treeShaking: true,
            minify: NODE_ENV === 'production',
            sourcemap: IS_DEV ? true : false
        })
        .catch(() => process.exit(1));

    await ctx.watch();
    // createServer((req, res) => {
    //     return clients.push(
    //         res.writeHead(200, {
    //             "Content-Type": "text/event-stream",
    //             "Cache-Control": "no-cache",
    //             "Access-Control-Allow-Origin": "*",
    //             Connection: "keep-alive",
    //         }),
    //     );
    // }).listen(process.env.PORT);

    // await ctx.watch();

    // let ctx = await esbuild.context(APP_BUILD_CONFIG);

    // // build html
    // //function buildHtml() {
    // console.log('buildHtml()');// called:', entryFile, outFile);
    // // make sure build directory existsSync
    // mkDirSync(OUTPUT_DIR);

    // const ctxHtml = await esbuild.context(HTML_BUILD_CONFIG);

    // await Promise.all([ctx.rebuild(), ctx.serve({ port: 4000 }), ctx.watch(), ctxHtml.rebuild(), ctxHtml.serve({ port: 4002 }), ctxHtml.watch()]);

}

// copies any imports or paths that start with /static to the build folder.
// todo: also needs to parse file contents for references to /static?
// let copyStaticPlugin = {
//     name: 'copy-static',
//     setup(build) {

//         function _findEnvFile(dir) {
//             if (!fs.existsSync(dir))
//                 return false;
//             let filePath = `${dir}/.env`;
//             if ((fs.existsSync(filePath))) {
//                 return filePath;
//             } else {
//                 return _findEnvFile(path.resolve(dir, '../'));
//             }
//         }

//         build.onResolve({ filter: /^static$/ }, async (args) => {
//             // find a .env file in current directory or any parent:
//             return ({
//                 path: _findEnvFile(args.resolveDir),
//                 namespace: 'env-ns',
//             })
//         })

//         build.onLoad({ filter: /.*/, namespace: 'env-ns' }, async (args) => {
//             // read in .env file contents and combine with regular .env:
//             let data = await fs.promises.readFile(args.path, 'utf8')
//             const buf = Buffer.from(data)
//             const config = require('dotenv').parse(buf);

//             return ({
//                 contents: JSON.stringify({ ...process.env, ...config }),
//                 loader: 'json'
//             });
//         })
//     }
// }

// call build for main app bundle
dev();