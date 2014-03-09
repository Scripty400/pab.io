var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-ruby-sass');
var notify = require('gulp-notify');

var paths = {
    scripts: {
        src: 'content/themes/pab/assets/javascripts/**/*.js',
        dest: 'content/themes/pab/assets/js'
    },
    styles: {
        src: 'content/themes/pab/assets/stylesheets/*.scss',
        dest: 'content/themes/pab/assets/css'
    }
};

/**
 * lint: lint javascript for errors.
 */
gulp.task('lint', function() {
    return gulp.src(paths.scripts.src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

/**
 * scripts: minify and copy all JavaScript (except vendor scripts)
 */
gulp.task('scripts', function() {
    return gulp.src(paths.scripts.src)
        .pipe(uglify())
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(notify({ message: "Scripts updated" }));
});

/**
 * styles: minify and concat sass files.
 */
gulp.task('styles', function() {
    return gulp.src(paths.styles.src)
        .pipe(sass())
        .pipe(concat('styles.min.css'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(notify({ message: "Styles updated." }));
});

/**
 * watch: monitor sass and js files. Recompile and/or lint on change.
 */
gulp.task('watch', function() {
    gulp.watch(paths.styles.src, ['styles']);
    gulp.watch(paths.scripts.src, ['lint', 'scripts']);
});

/**
 * testserver: source the virtual env and start up a test server on
 * localhost:8000.
 */
//gulp.task('testserver', function() {
//    return gulp.src('remind_me/remind_me/manage.py')
//}

gulp.task('default', ['lint', 'scripts', 'styles', 'watch']);
