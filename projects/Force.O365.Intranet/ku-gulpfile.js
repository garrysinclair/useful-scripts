/// <binding BeforeBuild='min' Clean='clean' ProjectOpened='watch' />

require('es6-promise').polyfill();
var gulp = require("gulp"),
    rimraf = require("gulp-rimraf"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    cssmin = require("gulp-cssmin"),
    sass = require("gulp-sass"),
    flatten = require("gulp-flatten"),
    uglify = require("gulp-uglify"),
    ts = require("gulp-typescript"),
    fs = require("fs"),
    replace = require("gulp-replace"),
    autop = require("gulp-autoprefixer"),
    gutil = require("gulp-util");

var paths = {
    webroot: "./",
    style: "./Stylesheets/",
    sass: "./Stylesheets/Sass/",
    font: "./Stylesheets/Fonts/",
    lib: "./lib/",
    scripts: "./Scripts/"
};

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

var supported = [
    "> 1%",
    "last 2 versions",
    "Android 2.3",
    "Android >= 4",
    "Chrome >= 20",
    "Firefox >= 24",
    "Explorer >= 9",
    "iOS >= 6",
    "Opera >= 12",
    "Safari >= 6"
];

var KUExProj = ts.createProject(paths.scripts + "KU/tsconfig.json");
var KUProj = ts.createProject(paths.scripts + "KU/tsconfig.json", { outFile : "./ku.js" });
var KUnetProj = ts.createProject(paths.scripts + "KUnet/tsconfig.json", { outFile : "./ku.js" });

paths.css = paths.style + "**/*.css";
paths.minCss = paths.style + "**/*.min.css";
paths.concatCssDest = paths.style + "ku.min.css";

paths.js = paths.scripts + "**/*.js";
paths.minJs = paths.scripts + "**/*.min.js";
paths.concatJsDest = paths.scripts + "ku.min.js";


gulp.task("sass", ["clean-css", "sass-ku", "sass-kunet", "sass-print"], function () {
    return gulp.src([paths.style + "KUnet/ku.css", paths.lib + "select2/dist/css/select2.css"])
        .pipe(concat("ku.css"))
        .pipe(gulp.dest(paths.style + "KUnet"));
});

gulp.task("sass-ku", [ "clean-css" ], function () {
    return gulp.src([paths.sass + "ku.scss"])
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(rename("ku.css"))
        .pipe(autop({
            browsers: supported,
            cascade: false
        }))
        .pipe(gulp.dest(paths.style + "KU"));
});

gulp.task("sass-kunet", [ "clean-css" ], function () {
    return gulp.src([paths.sass + "kunet.scss"])
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(rename("ku.css"))
        .pipe(autop({
            browsers: supported,
            cascade: false
        }))
        .pipe(gulp.dest(paths.style + "KUnet"));
});

gulp.task("sass-print", [ "clean-css" ], function () {
    return gulp.src([paths.sass + "ku.print.scss"])
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(gulp.dest(paths.style + "KU"))
        .pipe(gulp.dest(paths.style + "KUnet"));
}); 

gulp.task("js", [ "clean-js", "ts-ku", "ts-kunet", "ts-kuex" ], function () {
    return gulp.src([
            paths.lib + "/jquery/dist/jquery.js",
            paths.lib + "**/bootstrap.js",
            paths.lib + "/select2/dist/js/select2.full.js",
            paths.lib + "/mustache/mustache.js",
            paths.scripts + "/camljs.js"
    ])
        .pipe(concat("jquery.bootstrap.js"))
        .pipe(gulp.dest(paths.scripts + "KU"))
        .pipe(gulp.dest(paths.scripts + "KUnet"));
});

gulp.task("ts-ku", [ "clean-js" ], function () {
    return gulp.src([paths.scripts + "TypeScript/Accordion/*.ts",
            paths.scripts + "typings/bootstrap/*.d.ts",
            paths.scripts + "typings/jquery/*.d.ts"])
        .pipe(KUProj())
        .pipe(gulp.dest("."));
});

gulp.task("ts-kunet", [ "clean-js" ], function () {
    return gulp.src([paths.scripts + "**/*.ts", "!" + paths.scripts + "TypeScript/External/**/*.ts"])
        .pipe(KUnetProj())
        .pipe(gulp.dest("."));
});

gulp.task("ts-kuex", ["clean-js"], function () {
    return gulp.src([paths.scripts + "TypeScript/External/**/*.ts",
            paths.scripts + "typings/jquery/*.d.ts"])
        .pipe(KUExProj())
        .pipe(gulp.dest(paths.scripts + "KU"));
});

gulp.task("font", function () {
    return gulp.src(paths.lib + "**/glyphicons-halflings-regular.*")
        .pipe(flatten())
        .pipe(gulp.dest(paths.font + "bootstrap/"));
});

gulp.task("min-css", [ "clean-css", "sass" ], function () {
    return gulp.src([paths.css, "!" + paths.minCss, "!" + paths.style + "*.print.css"])
        .pipe(cssmin())
		.pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.style));
});

gulp.task("min-js", [ "clean-js", "js" ], function () {
    return gulp.src([paths.js, "!" + paths.minJs])
        .pipe(uglify().on('error', gutil.log))
		.pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.scripts));
});

gulp.task("min", [ "clean", "font", "min-css", "min-js" ]);

gulp.task("build", [ "clean", "font", "sass", "js" ]);

gulp.task("release", [ "clean", "min" ], function () {
    return gulp.src([paths.scripts + "**/ku.min.js", paths.scripts + "**/ku.js"])
        .pipe(replace("http://kunet-webapi.unicph.domain", "#{octopus-web-api-url}"))
        .pipe(replace("http://localhost:19259", "#{octopus-share-app-url}"))
        .pipe(replace("http://cdn.unicph.domain", "#{octopus-cdn-url}"))
        .pipe(replace("http://ograph-webapi.unicph.domain", "#{octopus-ograph-url}"))
        .pipe(replace("/KUnet/Local/Latest", "/KUnet/#{octopus-cdn-kunet-environment}/Latest"))
        .pipe(gulp.dest(paths.scripts));
    
});

gulp.task("clean", [ "clean-css", "clean-js" ]);

gulp.task("clean-css", function () {
    return gulp.src(paths.css, { read: false })
        .pipe(rimraf());
});

gulp.task("clean-js", function () {
    return gulp.src(paths.js, { read: false })
        .pipe(rimraf());
})

gulp.task("watch", function () {
    gulp.watch(paths.sass + "**/*.scss", ["min-css"]);
    gulp.watch(paths.scripts + "**/*.ts", ["min-js"]);
});
