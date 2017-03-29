var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['src/*.html']
};
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

//var jquery = require('jquery');

// gulp.task('copyHtml', function () {
//     return gulp.src(paths.pages)
//         .pipe(gulp.dest('dist'));
// });

// gulp.task('default', ['copyHtml'], function () {
//     return browserify({
//         basedir: '.',
//         debug: true,
//         entries: ['src/main.ts'],
//         cache: {},
//         packageCache: {}
//     })
//     .plugin(tsify)
//     .transform('babelify', {
//         presets: ['es2015'],
//         extensions: ['.ts']
//     })
//     .bundle()
//     .pipe(source('bundle.js'))
//     .pipe(buffer())
//     .pipe(sourcemaps.init({loadMaps: true}))
//     .pipe(sourcemaps.write('./'))
//     .pipe(gulp.dest('dist'));
// });



gulp.task("cr3", function () {
    return browserify({
        basedir: './src',
        debug: true,
        entries: [
            "Data/DataService.ts",
            "Services/NewsService.ts",
            "main.ts"
            ],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("./dist"));
});