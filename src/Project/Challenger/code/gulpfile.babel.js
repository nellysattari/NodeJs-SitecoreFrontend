/*jslint node: true, for */

'use strict';

let gulp = require(`gulp`),
    del = require(`del`),
    sass = require(`gulp-sass`),
    inject = require(`gulp-inject`),
    // babelRegister = require(`babel-register`),
    cssCompressor = require(`gulp-csso`),
    autoprefixerBrowserSpecific = require('autoprefixer'),
    htmlMinifier = require(`gulp-htmlmin`),
    htmlValidator = require(`gulp-html`),
    jsLinter = require(`gulp-eslint`),
    jsCompressor = require(`gulp-uglify`),
    imageCompressor = require(`gulp-imagemin`),
    // tempCache = require(`gulp-cache`),
    browserSync = require(`browser-sync`),
    reload = browserSync.reload,
    browserChoice = `default`,
    postcss = require('gulp-postcss'),


    htmlImport = require('gulp-html-import'),
    gulprename = require('gulp-rename'),
    path = require('path'),
    glob = require('glob'); /**Match files using the patterns the shell uses, like stars and stuff.**/

import { IncludedFeatures } from './includedFeatures.js';
const includedFeatures = new IncludedFeatures();
const SassFilesFeatures = includedFeatures.SassList();

const HTML_FILES_Watch = glob.sync(path.join(__dirname, '..', '..', '..', 'Feature', '**', 'code', 'Views', '*.html*'));

const SASS_FILES_Watch = glob.sync(path.join(__dirname, '..', '..', '..', 'Feature', '**', 'code', 'styles', '*.scss*'));
const JS_FILES = glob.sync(path.join(__dirname, '..', '..', '..', 'Feature', '**', 'code', 'Scripts', '*.js*'));
const HTML_Feature_Folder = glob.sync(path.join(__dirname, '..', '..', '..', 'Feature', '**', 'code', 'Views', '/'));

/**
 * CHOOSE A BROWSER OTHER THAN THE DEFAULT
 *
 * Each of the following tasks sets the browser preference variable “browserChoice”
 * used by the “serve” task. To preview your project in either or all of your
 * browsers, invoke Gulp as follows:
 *
 *    gulp safari serve
 *    gulp firefox serve
 *    gulp chrome serve
 *    gulp opera serve
 *    gulp edge serve
 *    gulp allBrowsers serve
 */

gulp.task(`safari`, function () {
    browserChoice = `safari`;
});

gulp.task(`firefox`, function () {
    browserChoice = `firefox`;
});

gulp.task(`chrome`, function () {
    browserChoice = `google chrome`;
});

gulp.task(`opera`, function () {
    browserChoice = `opera`;
});

gulp.task(`edge`, function () {
    browserChoice = `microsoft-edge`;
});

gulp.task(`allBrowsers`, function () {
    browserChoice = [`safari`, `firefox`, `google chrome`, `opera`, `microsoft-edge`];
});

/**
 * VALIDATE HTML
 *
 * This task sources all the HTML files in the dev/html folder, then validates them.
 *
 * On error, the validator will generate one or more messages to the console with
 * line and column co-ordinates, indicating where in your file the error was
 * generated.
 *
 * Note: Regardless of whether your HTML validates or not, no files are copied to a
 * destination folder.
 */
gulp.task(`validateHTML`, function () {
    return gulp.src([`src/Project/**/*.html`, `src/Feature/**/*.html`])
        .pipe(htmlValidator());




});

/**
 * COMPRESS HTML
 *
 * This task sources all the HTML files in the dev/html folder, strips comments and
 * whitespace from them, then writes the compressed file(s) to the production folder.
 */

//  we can ignore this 
// gulp.task(`compressHTML`, function () {
//     return gulp.src([`dev/html/*.html`, `dev/html/**/*.html`])
//         .pipe(htmlMinifier({
//             removeComments: true,
//             collapseWhitespace: true
//         }))
//         .pipe(gulp.dest(`prod`));
// });

/**
 * COMPILE CSS FOR DEVELOPMENT WORK
 *
 * This task looks for a single Sass file, compiles the CSS from it, and writes the
 * resulting CSS file to the temporary folder temp/styles. The file will be
 * formatted with 2-space indentations. Any floating-point calculations will be
 * carried out 10 places and browser-specific prefixes will be added to support 2
 * browser versions behind all current browsers’ versions.
 * The CSS browser prefixes which is specific to a different browser) are:
Android: -webkit-
Chrome: -webkit-
Firefox: -moz-
Internet Explorer: -ms-
iOS: -webkit-
Opera: -o-
Safari: -webkit-
 */
gulp.task(`compileCSSForDev`, function () {
    var autoPrefixerPlugins = [autoprefixerBrowserSpecific({ browsers: [`last 2 versions`] })]
    const SASS_INCLUDE_PATHS = [
        path.join(__dirname)
    ];
    return gulp.src(`styles/challenger-theme/challenger-theme.scss`)

        .pipe(inject(
            gulp.src(SassFilesFeatures, { read: false }), {
                starttag: '//injectFeatures',
                endtag: '//endinject',
                relative: true,
                transform: function (filepath) {
                    return '@import "' + filepath.replace(/^\//, "") + '";';
                }
            }))

        .pipe(sass({
            outputStyle: `expanded`,
            precision: 10,
            includePaths: [
                SASS_INCLUDE_PATHS,
                '../../../',//foundation in relation with gulp. used in Project\Challenger\code\styles\challenger-theme\challenger-theme.scss
                '../../../../',//node_module in relation with gulp. used in theming default.scss

            ]
        }).on(`error`, sass.logError))

        .pipe(postcss(autoPrefixerPlugins))
        .pipe(gulp.dest(`temp/styles`));
    //need to concat as well
});

/**
 * COMPILE CSS FOR PRODUCTION
 *
 * This task looks for a single Sass file, compiles the CSS from it, and writes the
 * resulting single CSS file to the production folder. Any floating-point
 * calculations will be carried out 10 places, and browser-specific prefixes will be
 * added to support 2 browser versions behind all current browsers’ versions.
 * Lastly, the final CSS file is passed through two levels of compression: One via
 * Sass as an option (“outputStyle”) and the other from the cssCompressor() module.
 */
gulp.task(`compileCSSForProd`, function () {
    // should be fixed
    return gulp.src(`styles/challenger-theme/challenger-theme.scss`)
        .pipe(sass({
            outputStyle: `compressed`,
            precision: 10
        }).on(`error`, sass.logError))
        .pipe(browserSpecificPrefixer({
            browsers: [`last 2 versions`]
        }))
        .pipe(cssCompressor())
        .pipe(gulp.dest(`prod/styles`));
});

/**
 * TRANSPILE JAVASCRIPT FILES FOR DEVELOPMENT
 *
 * This task sources all the JavaScript files in dev/scripts, transpiles them to ES6,
 * then writes the result to the temp/scripts folder.
 */
// gulp.task(`transpileJSForDev`, function () {

//     // glob.sync(pattern, [options])
//     // pattern {String} Pattern to be matched
//     // options {Object}
//     // return: {Array<String>} filenames found matching the pattern
//     // Perform a synchronous glob search.
//     console.log(JS_FILES);
//     return gulp.src(JS_FILES)
//         .pipe(babel())
//         .pipe(gulp.dest(`temp/scripts`));
// });

/**
 * TRANSPILE JAVASCRIPT FILES FOR PRODUCTION
 *
 * This task sources all the JavaScript files in dev/scripts, transpiles them to ES6,
 * compresses the output, then writes the result to the prod/scripts folder.
 */
// gulp.task(`transpileJSForProd`, function () {
//     // should be fixed
//     return gulp.src(`src/Feature/**/Scripts/*.js`)
//         .pipe(babel())
//         .pipe(jsCompressor())
//         .pipe(gulp.dest(`prod/scripts`));
// });

/**
 * LINT JAVASCRIPT
 *
 * This task sources all the JavaScript files in dev/scripts and lints them.
 * Errors/warnings are formatted using ESLint’s “compact” option for error reporting.
 *
 * https://eslint.org/docs/user-guide/formatters/#compact
 */
gulp.task(`lintJS`, function () {
    return gulp.src(`src/Feature/**/Scripts/*.js`)
        .pipe(jsLinter({
            rules: {
                indent: [2, 4, { SwitchCase: 1 }],
                quotes: [2, `backtick`],
                semi: [2, `always`],
                'linebreak-style': [2, `unix`],
                'max-len': [1, 85, 4]
            },
            env: {
                es6: true,
                node: true,
                browser: true
            },
            extends: `eslint:recommended`
        }))
        .pipe(jsLinter.formatEach(`compact`, process.stderr));
});

/**
 * COMPRESS THEN COPY IMAGES TO THE PRODUCTION FOLDER
 *
 * This task sources all the images in the dev/img folder, compresses them based on
 * the settings in the object passed to imageCompressor, then copies the final
 * compressed images to the prod/img folder.
 */
// gulp.task(`compressThenCopyImagesToProdFolder`, function () {
//     return gulp.src(`dev/img/**/*`)
//         .pipe(tempCache(
//             imageCompressor({
//                 optimizationLevel: 3, // For PNG files. Accepts 0 – 7; 3 is default.
//                 progressive: true,    // For JPG files.
//                 multipass: false,     // For SVG files. Set to true for compression.
//                 interlaced: false     // For GIF files. Set to true for compression.
//             })
//         ))
//         .pipe(gulp.dest(`prod/img`));
// });

/**
 * COPY UNPROCESSED ASSETS TO THE PRODUCTION FOLDER
 *
 * This task copies all unprocessed assets that aren’t images, JavaScript,
 * Sass/CSS to the production folder, because those files are processed by other
 * tasks, specifically:
 *
 * — Images are handled by the compressThenCopyImagesToProdFolder task
 * — JavaScript is handled by the transpileJSForProd task
 * — Sass/CSS is handled by the compileCSSForProd task
 */
// gulp.task(`copyUnprocessedAssetsToProdFolder`, function () {
//     return gulp.src([
//         `src/*.*`,       // Source all files,
//         `src/**`,        // and all folders,
//         `!dev/html/`,    // but not the HTML folder
//         `!dev/html/*.*`, // or any files in it
//         `!dev/html/**`,  // or any sub folders;
//         `!dev/img/`,     // ignore images;
//         `!dev/**/*.js`,  // ignore JS;
//         `!dev/styles/**` // and, ignore Sass/CSS.
//     ], {dot: true}).pipe(gulp.dest(`prod`));
// });

/**
 * BUILD
 *
 * Meant for building a production version of your project, this task simply invokes
 * other pre-defined tasks.
 */
// gulp.task(`build`, [
//     `validateHTML`,
//     `compressHTML`,
//     `compileCSSForProd`,
//     `lintJS`,
//     `transpileJSForProd`,
//     `compressThenCopyImagesToProdFolder`,
//     `copyUnprocessedAssetsToProdFolder`
// ]);

// Font Copying
// Fonts are part the branding so it must not get changed in any circumastances. 
// All fonts will be located in a original folder , preferably we will move it to another repo. Out of that folder we copy fonts on the fly. 
gulp.task('copyfonts', () => gulp.src('style-guide/dist/fonts/*.{ttf,woff,woff2,eof,svg}')
    .pipe(gulp.dest('../../../Foundation/Theming/code/styles/fonts')));



gulp.task('importHtml', function () {

    console.log("the path we fetch HTMLs:", HTML_Feature_Folder);
    gulp.src('Views/Layouts/Default_import.html')
        .pipe(htmlImport(HTML_Feature_Folder))
        .pipe(gulprename("Default.html"))
        .pipe(gulp.dest('Views/Layouts'));
})



/**
 * SERVE
 *
 * Used for development, this task…
 *
 *    — compiles CSS via Sass,
 *    — transpiles JavaScript files into ES6,
 *    — lints JavaScript, and
 *    — validates HTML.
 *
 * Your localhost server looks for index.html as the first page to load from either
 * the temporary folder (temp), the development folder (dev), or the folder
 * containing HTML (html).
 *
 * Files that require pre-processing must be written to a folder before being served.
 * Thus, CSS and JS are served from a temp folder (temp), while un-processed files,
 * such as fonts and images, are served from the development source folder (dev).
 *
 * If a JavaScript file is changed, all JavaScript files are linted, re-transpiled,
 * and the browser reloads.
 *
 * If a Sass file is changed, a re-compilation of the primary CSS file is generated,
 * and the browser reloads.
 *
 * Finally, changes to images also trigger a browser reload.
 */
//server: Use the built-in static server for basic HTML/JS/CSS websites. Basedir is just for // Multiple base directories server: ["app", "dist"]
// baseDir for serving static files is it is based on https://github.com/expressjs/serve-static. The file to serve will be determined by combining req.url with the provided root directory

gulp.task(`serve`, [`compileCSSForDev`, `copyfonts`, `validateHTML`, 'importHtml'], function () {
    browserSync({
        notify: true,
        port: 9000,
        reloadDelay: 100,
        browser: browserChoice,
        server: {
            baseDir: [
                `temp`,
                `Views/Layouts/`,
                `images`
            ],
            index: "Default.html"
        }
    });


    // gulp.watch(`dev/scripts/*.js`, [`lintJS`, `transpileJSForDev`])
    //     .on(`change`, reload);
 
    gulp.watch([`Views/**/*.html`], [`importHtml`])
        .on(`change`, reload);

    gulp.watch(`scripts/**/*.js`, [`serve`])
        .on(`change`, reload);


    gulp.watch(HTML_FILES_Watch, [`importHtml`])
        .on(`change`, reload);

    gulp.watch(SASS_FILES_Watch, [`compileCSSForDev`])
        .on(`change`, reload);

});

/**
 * CLEAN
 *
 * This task deletes the temp and prod folders, both of which are expendable, since
 * Gulp creates them as temporary folders during the serve and build tasks.
 */
gulp.task(`clean`, function () {
    let fs = require(`fs`),
        i,
        expendableFolders = [`temp`, `prod`];

    for (i = 0; i < expendableFolders.length; i += 1) {
        try {
            fs.accessSync(expendableFolders[i], fs.F_OK);
            process.stdout.write(`\n\tThe ${colors.green}${expendableFolders[i]}` +
                `${colors.default} directory was found and ${colors.green}` +
                `will ${colors.default}be deleted.\n`);
            del(expendableFolders[i]);
        } catch (error) {
            if (error) {
                process.stdout.write(`\n\tThe ${colors.red}` +
                    `${expendableFolders[i]} ${colors.default}` +
                    `directory does ${colors.red}not ${colors.default}` +
                    `exist or is ${colors.red}not ${colors.default}` +
                    `accessible.\n`);
            }
        }
    }

    process.stdout.write(`\n`);
});

/**
 * DEFAULT
 *
 * This task does nothing but list the available tasks in this file.
 */
gulp.task(`default`, function () {
    let exec = require(`child_process`).exec;

    exec(`gulp --tasks`, function (error, stdout, stderr) {
        if (null !== error) {
            process.stdout.write(`An error was likely generated when invoking ` +
                `the “exec” program in the default task.`);
        }

        if (`` !== stderr) {
            process.stdout.write(`Content has been written to the stderr stream ` +
                `when invoking the “exec” program in the default task.`);
        }

        process.stdout.write(`\n\tThis default task does ` +
            `nothing but generate this message. The ` +
            `available tasks are:\n\n ${stdout}`);
    });
});
