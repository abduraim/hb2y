const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

const styles = {
    src: './assets/scss/**/*.scss',
    dest: './'
};

const scripts = {
    src: './assets/js/**/*.js',
    dest: './js/'
};

gulp.task('scss', function (){
    return gulp.src(styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['cover 99.5%']}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(styles.dest))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function (){
    return gulp.src(scripts.src)
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js', {newLine: ';'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(scripts.dest));
});


function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(styles.src, gulp.parallel('scss'));
    gulp.watch(scripts.src, gulp.parallel('scripts'));
    gulp.watch(styles.src).on('change', browserSync.reload);
    gulp.watch(scripts.src).on('change', browserSync.reload);
    gulp.watch('./index.html').on('change', browserSync.reload);
}

gulp.task('default', watch);