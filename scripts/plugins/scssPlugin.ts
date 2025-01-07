const path = require('path');

module.exports = {
    name: 'scss',
    setup(build) {
        // Redirect all paths css, scss or sass
        build.onResolve({ filter: /.\.s[ac]ss$/ }, (args) => {
            let path1 = args.resolveDir.replace('/dist', '');
            path1 = args.resolveDir.replace('/build', '');
            //console.log(`resolve:`, args.resolveDir, args, path1, path.join(path1, args.path));
            return { path: path.join(path1, args.path) };
        });
    },
};