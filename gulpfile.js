const gulp = require('gulp')
const del = require('del')
const plumber = require('gulp-plumber')

const imagemin = require('gulp-imagemin')
const mozjpeg = require('imagemin-mozjpeg')
const pngquant = require('imagemin-pngquant')
const exec = require('child_process').exec

const paths = {
  images: {
    src: 'src/images/**/*',
    dest: 'dist/images/'
  },
  copys: {
    src: ['_locales/**/*', 'background.js', 'manifest.json'],
    dest: 'dist/'
  }
}

const config = {
  plumberConfig: {
    errorHandler: function (err) {
      console.log(err.toString())
      this.emit('end')
    }
  }
}

const clean = () => del([ 'dist' ])

function images() {
  return gulp.src(paths.images.src)
    .pipe(plumber(config.plumberConfig))
    .pipe(imagemin([
      pngquant(),
      mozjpeg()
    ], {
      verbose: true
    }))
    .pipe(gulp.dest(paths.images.dest))
}

function copys() {
  return gulp.src(paths.copys.src, { base: '.' })
    .pipe(gulp.dest(paths.copys.dest))
}

function watch() {
  gulp.watch(paths.images.src, images)
  gulp.watch(paths.copys.src, copys)
}

function parcel() {
  exec('parcel watch src/options.html --no-hmr')
}
const build = gulp.parallel(images, copys)

exports.build = build

exports.serve = gulp.series(clean, build, gulp.parallel(parcel, watch))
