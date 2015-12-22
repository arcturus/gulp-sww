var gulp = require('gulp');
var gulpsww = require('../../');


gulp.task('offline', function() {
  return gulp.src('**/*', { base : './' } )
    .pipe(gulpsww('files.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['offline']);
