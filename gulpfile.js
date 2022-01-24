const {src, dest, parallel, watch} = require('gulp'),
      sass = require('gulp-sass')(require('sass')),
      browserSync = require('browser-sync').create(),
      autoprefixer = require('gulp-autoprefixer'),
      cleanCss = require('gulp-clean-css'),
      rename = require('gulp-rename'),
      sourcemaps = require('gulp-sourcemaps'),
      ttf2woff = require('gulp-ttf2woff'),
      ttf2woff2 = require('gulp-ttf2woff2'),
      htmlmin = require('gulp-htmlmin'),
      fonter = require('gulp-fonter'),
      webp = require('gulp-webp'),
      del = require('del');

function styles() {
    return src('src/sass/**/*.+(scss|sass)')
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(rename({
            suffix: ".min",
            prefix: ""
        }))
        .pipe(cleanCss({compatibility: "ie8"}))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

function watcher() {
    watch('src/sass/**/*.+(scss|sass|css)').on('change', parallel(styles));
    watch('src/*.html').on('change', parallel(html));
    watch('src/img/**/*').on('all', parallel(images));
    watch('src/icons/**/*').on('all', parallel(icons));
    watch('src/js/**/*').on('change', parallel(scripts));
    watch('src/mailer/**/*').on('all', parallel(mailer));
    watch('src/fonts/**/*').on('all', parallel(fonts));
}

function server() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        notify: false,
        port: 3000
    });

    watch('src/*.html').on('change', browserSync.reload);
}

function html() {
    return src('src/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(dest('dist/'))
        .pipe(browserSync.stream());
}

function images() {
    return src('src/img/**/*')
        .pipe(dest('dist/img'))
        .pipe(browserSync.stream());
}

function icons() {
    return src('src/icons/**/*')
        .pipe(dest('dist/icons'))
        .pipe(browserSync.stream());
}

function scripts() {
    return src('src/js/**/*')
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
}

function fonts() {
    return src('src/fonts/**/*')
        .pipe(ttf2woff())
        .pipe(ttf2woff2())
        .pipe(dest('dist/fonts'))
        .pipe(browserSync.stream());
}

function mailer() {
    return src('src/mailer/**/*')
        .pipe(dest('dist/mailer'))
        .pipe(browserSync.stream());
}

function otf2ttf() {
    return src('src/fonts/**/*.otf')
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest('src/fonts'));
}

function imagesToWebp() {
    return src('src/img/**/*')
        .pipe(webp())
        .pipe(dest('dist/img'));
}

function deletedDerictories() {
    return del('dist');
}

exports.styles = styles;
exports.server = server;
exports.watcher = watcher;
exports.images = images;
exports.html = html;
exports.icons = icons;
exports.scripts = scripts;
exports.fonts = fonts;
exports.mailer = mailer;
exports.otf2ttf = otf2ttf;
exports.imagesToWebp = imagesToWebp;
exports.deletedDerictories = deletedDerictories;
exports.default = parallel(styles, server, watcher, html, images, icons, scripts, fonts, mailer);