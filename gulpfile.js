var gulp = require('gulp');
var server = require('gulp-server-livereload');
 
gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: true,
      port: 8002,
      livereload: {port: 35730},
      fallback: 'index.html'
    }));
});

gulp.task('default', ['webserver']);