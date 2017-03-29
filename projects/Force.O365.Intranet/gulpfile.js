/// <binding BeforeBuild='compile' AfterBuild='copyToWebParts' />
var gulp = require("gulp");
var ts = require("gulp-typescript");
var del = require('del');
var merge = require('merge2');
var tsProject = ts.createProject("tsconfig.json");
var bundleconfig = require("./bundleconfig.json");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var gutil = require('gulp-util');

// https://github.com/ivogabe/gulp-typescript#source-maps 
// .pipe(sourcemaps.init()) // This means sourcemaps will be generated 
// .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file 

function getBundles(extension) {
    return bundleconfig.filter(function (bundle) {
        return new RegExp(`${extension}$`).test(bundle.outputFileName);
    });
}

gulp.task('clean', function () {
    del.sync(['dist']);
});

gulp.task("compile", ['clean'], function () {
    return tsResult = tsProject.src()
            .pipe(tsProject())
            .pipe(gulp.dest('./dist'));
});

gulp.task("default", ["max:js"]);

gulp.task("max:js", ['compile'], function () {
    var tasks = getBundles(".js").map(function (bundle) {
        return gulp.src(bundle.inputFiles, { base: "./dist" })
            .pipe(concat(bundle.outputFileName.replace(".min", "")))
            .pipe(gutil.noop())
            .pipe(gulp.dest("./dist"));
    });
    return merge(tasks);
});

gulp.task('watch', ['default'], function () {
    gulp.watch('src/**/*.ts', ['default']);
});