/* File: gulpfile.js */

    // Main taks manager
var gulp   = require('gulp'),
    // Needed for accessing environment variables
    gutil = require('gulp-util'),
    // Gatheres all files into one
    concat = require('gulp-concat'),
    // Gives hints on js mistakes/errors
    jshint = require('gulp-jshint'),
    // Makes JS minified (less size) and ugly
    uglify = require('gulp-uglify'),
    // Makes CSS beatiful
    cleanCSS = require('gulp-clean-css'),
    // Reloads browser
    browserSync = require('browser-sync').create(),
    // Minifies images
    tinypng = require('gulp-tinypng'),
    // Watches new images
    watch = require('gulp-watch');

    // Folder of source files
var source = "source",
    // Folder of compiled files
    production = "production";

// define the default task and add the watch task to it
gulp.task('default', ['serve']); //, 'watch'

// jshint: takes source, makes it beatiful
gulp.task('jshint', function() {
  return gulp.src(source+'/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// js building: takes source, if production — minifies, else — just copies
gulp.task('build-js', function() {
  return gulp.src(source+'/js/*.js')
      .pipe(concat('main.js'))
      .pipe(gutil.env.type === production ? uglify() : gutil.noop()) //only uglify if gulp is ran with '--type production'
    .pipe(gulp.dest(production+'/js'));
});

// css minifier: takes source, minifies and copies
gulp.task('minify-css', function() {
  return gulp.src(production+'/css/*.css')
    //.pipe(concat('main.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(production+'/css'));
});

// "production": minifies css, js and images
gulp.task('production', ["minify-css", "build-js", "imgmin"]);

// autoprefix: takes source, make css according to standards, copies
gulp.task('autoprefix', function () {
    var postcss      = require('gulp-postcss');
    var autoprefixer = require('autoprefixer');

    return gulp.src(source+'/css/*.css')
        .pipe(postcss( [autoprefixer({browsers: ['last 3 versions', 'ie 7-11']})] ))
        .pipe(gulp.dest(production+'/css'));
});

// img minifier: takes source, minifies with API and copies
gulp.task('imgmin', function(){
  var imageminOptipng = require('imagemin-optipng');
    gulp.src(source+'/images/**/*')
        .pipe(tinypng('df3NQWkNZSm4fgW4hVyWRRjjLVPnLYd_'))
        .pipe(gulp.dest(production+'/images/'));
});

// Tasks for browser reload
gulp.task('js-watch', ['build-js', 'jshint'], function (done) {
    browserSync.reload();
    done();
});
gulp.task('css-watch', ['autoprefix'], function (done) { //'minify-css'
    browserSync.reload();
    done();
});
// Default task for watching html, css, js files and reloading browser
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("*.html").on("change", browserSync.reload);
    gulp.watch(source+'/css/*.css', ['css-watch']);
    gulp.watch(source+'/js/*.js', ['js-watch']);
});
