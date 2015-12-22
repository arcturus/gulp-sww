gulp-sww
========

A [gulp](http://gulpjs.com/) plugin that will automatically generate all the files and infrastructure to make your web app work offline with ServiceWorkers.

Details
-------
This plugin uses the library [ServiceWorkerWare](https://github.com/fxos-components/serviceworkerware) to provide the integration with ServiceWorker.

The steps this plugin provide are the following:

+ Receives a stream with your final set of assets.
+ Generate the files to create the worker and support the offline mode.
+ Modifies your `index.html` page to install the worker.


Usage
-----
```
requrie gulpsww = require('gulp-sww');

gulp.task('offline', function() {
  return gulp.src('**/*', { cwd : '<your working directory>' } )
    .pipe(gulpsww())
    .pipe(gulp.dest('<output directory>'));
});
```

Examples
--------
You can find a simple example in the `examples/app1` folder, just execute `gulp` from that directory to see how the content is modified.

Also [here](https://github.com/arcturus/ldjam-32/commit/4de02e5325136c78adced58a833f742e89c2452f) you can find how this plugin has been used to add offline support to a [HTML5 game](https://github.com/belen-albeza/ldjam-32) by [LadyBenko](http://www.belenalbeza.com/).

Notes
-----
This plugin requires node version >= 4.2.0
