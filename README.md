gulp-sww
========

A [gulp](http://gulpjs.com/) plugin to make your web app work offline.

How it works
------------
Once applied to your app, this plugin code caches all your frontend assets using
service workers if supported.

If not, AppCache is used. In this mode, the main page is redirected to an empty
page that uses appcache to cache your assets. When all the caching operations
are done, the user is redirected back to the main page.
This redirection only happens once.

Please note that it will only work on web app served over https.

Details
-------
Make sure to serve the web app over `https`.

This plugin uses the library [ServiceWorkerWare](https://github.com/fxos-components/serviceworkerware) to provide the integration with Service Worker.
The AppCache manifest is generated by [node-appcache-generator](https://github.com/arcturus/node-appcache-generator).

The steps this plugin provide are the following:

+ Receives a stream with your final set of assets.
+ Generates the files to create the worker and support the offline mode.
+ Modifies your `index.html` page to install the caching logic.

Usage
-----
```javascript
var gulpsww = require('gulp-sww');

gulp.task('offline', function() {
  return gulp.src('**/*', { cwd : '<your working directory>' } )
    .pipe(gulpsww())
    .pipe(gulp.dest('<output directory>'));
});
```

By default, the `index.html` page is modified but you can specify a different
entry point:
```javascript
gulp.task('offline', function() {
  return gulp.src('**/*', { cwd : '<your working directory>' } )
    .pipe(gulpsww({ entryPoint: 'main.html' }))
    .pipe(gulp.dest('<output directory>'));
});
```

Examples
--------
You can find a simple example in the `examples/app1` and  `examples/app2`
folders, just execute `gulp` from these directories to see how the content is
modified.

Also [here](https://github.com/arcturus/ldjam-32/commit/4de02e5325136c78adced58a833f742e89c2452f)
you can find how this plugin has been used to add offline support to a
[HTML5 game](https://github.com/belen-albeza/ldjam-32) by [LadyBenko](http://www.belenalbeza.com/).

Notes
-----
This plugin requires node version >= 4.2.0.
