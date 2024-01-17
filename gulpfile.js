import gulp from 'gulp';
import browserSync from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import gulpSass from 'gulp-sass';
import sassCompiler from 'sass';

const sass = gulpSass(sassCompiler);

// Static Server + watching scss/html files
gulp.task('serve', function () {
    browserSync.init({
        server: ".",
        notify: true
    });

    gulp.watch("lib/css/*.scss", gulp.series('sass'));
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("lib/css/bootstrap/*.scss", gulp.series('bootstrap'));
});

gulp.task('sass', function () {
    return gulp.src('lib/css/*.scss') // main.scss dosyasını hedef alıyoruz
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('lib/css/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('bootstrap', function () {
    return gulp.src('lib/css/bootstrap/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('lib/css/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('default', gulp.parallel('sass', 'serve', 'bootstrap'));
