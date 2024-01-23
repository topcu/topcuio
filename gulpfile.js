import gulp from 'gulp';
import browserSync from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import gulpSass from 'gulp-sass';
import sassCompiler from 'sass';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import htmlmin from 'gulp-htmlmin';
import gulpIf from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import sassGlob from 'gulp-sass-glob';


const sass = gulpSass(sassCompiler);

// Serve görevi
gulp.task('serve', function () {
    browserSync.init({
        server: ".",
        notify: true
    });

    gulp.watch("lib/css/**/*.{scss,css}", gulp.series('sass'));
    gulp.watch("*.html").on('change', browserSync.reload);
});

// Sass görevi
gulp.task('sass', function () {
    return gulp.src('lib/css/**/*.{scss,css}')
        .pipe(sassGlob()) // SCSS dosyalarında glob kullanımını desteklemek için
        .pipe(sourcemaps.init()) // Kaynak haritası oluştur
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
        }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.')) // Kaynak haritasını yaz
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// JS birleştirme ve minify görevi
gulp.task('js', function () {
    return gulp.src('lib/js/**/*.js')
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Build görevi
gulp.task('build', gulp.parallel('sass', 'js', function () {
    return gulp.src(['index.html', 'page.html'])
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
}));

// Default görevi
gulp.task('default', gulp.series('sass', 'js', 'serve'));