var gulp = require('gulp'),
    ngrok = require('ngrok'),
    connect = require('gulp-connect'),
    site = '';


gulp.task('serve',['connect','ngrok-url']);

gulp.task('connect', function() {
  connect.server({
    root: 'src',
    port: 8000,
  });
});

gulp.task('ngrok-url', function() {
  return ngrok.connect(8000, function (err, url) {
    site = url;
    console.log('serving your tunnel from: ' + site);
  });
});
