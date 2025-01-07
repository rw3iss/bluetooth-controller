// @ts-check

const fs = require("fs");
const http = require("http");
const esbuild = require("esbuild");
const path = require("path");
const { sassPlugin } = require('esbuild-sass-plugin');

// ===== Configuration =====

const port = parseInt(process.argv[process.argv.indexOf("--port") + 1]) || 8080;
const watch = process.argv.includes("--watch");
const serve = process.argv.includes("--serve");

const sourceDir = "src";
const outDir = "build";
const staticDir = "public";

const pluginCache = new Map();
const CWD = path.resolve('./');

/** @type {esbuild.BuildOptions} */
const esbuildOptions = {
    logLevel: "info",
    entryPoints: [`${sourceDir}/index.ts`],
    bundle: true,
    outfile: `${outDir}/app.js`,
    platform: "browser",
    plugins: [
        sassPlugin({
            cache: pluginCache,
            // importMapper: (path) => {
            //     //console.log(`import`, path);
            //     return path.replace(/(src\/styles\/includes)/g, `./src/styles/includes.scss`);
            // },
            loadPaths: [`${CWD}`],
            // precompile: (source, pathname) => {
            //     const basedir = path.dirname(pathname);
            //     return source.replace(/(src\/styles\/includes)/g, `${CWD}/src/styles/includes.scss`);
            // }
        }),
    ]
};

// ===== Implementation =====

const green = "\033[32m";
const red = "\033[31m";
const reset = "\033[0m";

// If defined, we very recently saw a change, and are waiting a bit to see if more
// changes show up before rebuilding and reloading the page.
/** @type {ReturnType<typeof setTimeout> | undefined} */
let timeout = undefined;

// If this is defined, we're in the process of doing a build.
// In this case, we should not
/** @type {Promise<unknown> | undefined} */
let buildPromise = undefined;

// The previous build result, for use in watch/serve
/** @type {esbuild.BuildResult | undefined} */
let build = undefined;

// The previous build result, for use in watch/serve
/** @type {esbuild.BuildContext | undefined} */
let context = undefined;

// This is used for automatically reloading the page.
// browsers will listen to http://localhost:8080/live-reload
// and we'll send a reload message whenever something finishes building.
/** @type {Set<http.ServerResponse>} */
const activeClients = new Set();

// This sometimes matters (JS generally), so be consistent
// about always including a mime type. Will probably need to extend
// this with more later.
const mimeTypes = {
    js: "text/javascript",
    css: "text/css",
    html: "text/html",
};

function reloadBrowsers() {
    for (const listener of activeClients) {
        listener.write("data: reload\n\n");
    }
}

const listenerScript = `<script>
(function(e) {
  e.onmessage = () => {
    e.close();
    location.reload();
  }
}(new EventSource("http://localhost:${port}/live-reload")))
</script>`;

/**
 * @param {http.ServerResponse} res
 * @param {string} file
 */
function sendFile(res, file) {
    const lastDot = file.lastIndexOf(".");
    const ext = lastDot === -1 ? "" : file.substring(lastDot + 1);
    if (ext in mimeTypes) {
        res.setHeader("Content-Type", mimeTypes[ext]);
    } else {
        res.setHeader("Content-Type", "text/plain");
    }

    if (file.endsWith(".html")) {
        // Inject code to handle live reload
        fs.readFile(file, "utf-8", (err, content) => {
            if (err) throw err;
            res.end(content.replace("</body>", `${listenerScript}</body>`));
        });
    } else {
        fs.createReadStream(file).pipe(res, {
            end: true,
        });
    }
}

function startServer() {
    const server = http.createServer(function processRequest(req, res) {
        if (req.url === "/live-reload") {
            const headers = {
                "Content-Type": "text/event-stream",
                Connection: "keep-alive",
                "Cache-Control": "no-cache",
            };
            res.addListener("close", () => activeClients.delete(res));
            res.writeHead(200, headers);
            activeClients.add(res);
            return;
        }

        // If in the middle of a build, don't respond with a file until the build is finished.
        if (buildPromise) {
            buildPromise.then(() => processRequest(req, res));
            return;
        }

        let page = req.url;
        if (page === "/") page = "/index.html";
        page = page.substring(1); // strip off leading /

        fs.readdir(staticDir, (_err, files) => {
            // First check the static directory for the file
            if (files?.includes(page)) {
                sendFile(res, path.join(staticDir, page));
            } else {
                // Then check the build directory
                fs.readdir(outDir, (_err, files) => {
                    if (files?.includes(page)) {
                        sendFile(res, path.join(outDir, page));
                    } else {
                        // If in neither, not found.
                        res.statusCode = 404;
                        res.end("404 not found.");
                    }
                });
            }
        });
    });

    server.listen(port);
    startWatch();
}

function startWatch() {
    requestBuild();
    fs.watch(sourceDir, { recursive: true }).on("change", requestBuild);
    fs.watch(staticDir, { recursive: true }).on("change", reloadBrowsers);
}

function requestBuild() {
    if (buildPromise) {
        buildPromise.then(requestBuild);
        return;
    }

    if (timeout) {
        clearTimeout(timeout);
    }

    // Wait a bit before actually doing the build, to avoid double builds when
    // format on save is enabled.
    timeout = setTimeout(doBuild, 100);
}

function doBuild() {
    console.clear();
    const start = Date.now();
    timeout = undefined;

    // If we have had a previous successful build, do a rebuild for a faster build
    // Otherwise, build from scratch, and save the result if successful
    buildPromise = build
        ? build.rebuild()
        : esbuild.build(esbuildOptions).then((result) => (build = result));

    buildPromise
        .then(() => {
            // Successful build, reload the page.
            reloadBrowsers();
            buildPromise = undefined;
            console.log(
                `\n${green}Finished build in ${Date.now() - start}ms${reset}\n`
            );
            if (serve) {
                console.log(`Listening on http://localhost:${port}\n`);
            }
        })
        .catch(() => {
            // Errors have already been logged to console, ignore passed in errors
            buildPromise = undefined;
            console.log(
                `\n${red}Finished build in ${Date.now() - start
                }ms with errors${reset}\n`
            );
        });
}

async function main() {
    if (serve) {
        startServer();
    } else if (watch) {
        startWatch();
    } else {
        await esbuild.build(esbuildOptions);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});