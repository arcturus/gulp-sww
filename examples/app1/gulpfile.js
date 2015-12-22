var gulp = require('gulp');
var gulpsww = require('../../');


gulp.task('offline', function() {
  return gulp.src('**/*', { cwd : './' } )
    .pipe(gulpsww())
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['offline']);
