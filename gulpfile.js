// プラグインを読み込む
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const imagemin = require('gulp-imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const notify = require('gulp-notify')

// タスクとなる関数
// html
function htmlCopy() {
    return gulp.src('src/**/*.html')
    .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(notify({
        message: 'HTMLをコピーしました',
        onLast: true,
    }))
    .pipe(gulp.dest('dest'));
}

// sass
function cssTranspile() {
    return gulp.src('src/sass/**/*.scss')
    .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(notify({
        message: 'Sassをコンパイルしました',
        onLast: true,
    }))

    .pipe(sass())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(gulp.dest('dest/css'));
}

// img
function imageCompress() {
    return gulp.src('src/img/**/*')
    .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(notify({
        message: '画像を圧縮しました',
        onLast: true,
    }))
    .pipe(imagemin([
        imageminGifsicle({ optimizationLevel: 3 }),
        imageminPngquant(),
        imageminMozjpeg({ quality: 50 }),
        imageminSvgo({ plugins : [{
            name: 'removeViewBox',
            active: false,
        }]})
    ] , { verbose : true} ))
    .pipe(gulp.dest('dest/img'));
}

// watch
// ブラウザのオートリロードを初期化する
function browserSyncInit() {
    browserSync.init({
        server : {
            baseDir: 'dest' ,
        },
    });
}

// ブラウザのオートリロードを行う関数
function browserSyncReload(callback) {
    browserSync.reload();
    callback();
}

// ファイルの変更を監視して変更されたらリロードする関数
function watchFiles() {
    gulp.watch('src/**/*.html',gulp.series(htmlCopy, browserSyncReload));
    gulp.watch('src/sass/**/*.scss', gulp.series(cssTranspile, browserSyncReload));
    gulp.watch('src/img/**/*',gulp.series(imageCompress, browserSyncReload));
}

// defaultタスクと関数を結びつける
exports.default = gulp.series(htmlCopy, cssTranspile, imageCompress,
    gulp.parallel(browserSyncInit, watchFiles)
    );

    // 終わらせる時はCtr＋Cで。そうしないと動き続ける。