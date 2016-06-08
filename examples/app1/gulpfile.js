var gulp = require('gulp');
var gulpsww = require('../../');
var package = require('./package.json');


gulp.task('offline', function() {
  return gulp.src([
    '**/*',
    '!gulpfile.js',
    '!package.json'
  ], { cwd: './' })
    .pipe(gulpsww({ 'version': package.version }))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['offline']);
