var gulp = require('gulp'),
    ngrok = require('ngrok'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    csso = require('gulp-csso'),
    htmlmin = require('gulp-htmlmin')
    replace = require('gulp-html-replace')
    rename = require('gulp-rename'),
    inlinesource = require('gulp-inline-source'),
    site = '';

gulp.task('build', ['scripts', 'styles','html']);
gulp.task('serve',['build','connect','ngrok-url']);

gulp.task('scripts', function(){
  gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(rename(function(path) {
      path.dirname += "/js";
      path.basename += ".min";
      path.extname = ".js"
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('styles', function(){
  gulp.src('src/css/*.css')
    .pipe(csso())
    .pipe(rename(function(path) {
      path.dirname += "/css";
      path.basename += ".min";
      path.extname = ".css";
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('html', function(){
  gulp.src('src/*.html')
    .pipe(inlinesource())
    .pipe(replace({
      'css': '<link rel="stylesheet" href="css/main.min.css" type="text/css">',
      'js': {
        src: ['js/app.min.js', 'js/ui.min.js'],
        tpl: '<script src="%s"></script>'
      }
    }))
    .pipe(htmlmin())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    port: 8000,
  });
});

gulp.task('ngrok-url', function() {
  return ngrok.connect(8000, function (err, url) {
    site = url;
    console.log('serving your tunnel from: ' + site);
  });
});
