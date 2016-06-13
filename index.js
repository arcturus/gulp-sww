var through = require('through');
var File = require('vinyl');
var templates = require('./templates');
var fs = require('fs');
var AppCache = require('node-appcache-generator');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-sww';

module.exports = function(options) {
  options = options || {};

  var entryPoint = options.entryPoint || 'index.html';
  var version = options.version || '1.0.0';
  var hookSW = options.hookSW || null;
  var paths = [];

  var onFile = function(file) {
    var path = file.path.substr(file.base.length);
    if (file.isBuffer()) {
      paths.push(path);
    }

    if (file.isBuffer() && path === entryPoint) {
      // Create the install file and append it's load
      var installFile = new File({
        path: 'install-sw.js',
        contents: new Buffer(templates.INSTALL_TPL_JS)
      });
      this.emit('data', installFile);
      var content = String(file.contents);
      content = content.replace('<head>',
        '<head><script defer async src="install-sw.js"></script>');
      file.contents = new Buffer(content);
      this.push(file);
    }
  };

  var onEnd = function() {
    var filesToLoad = JSON.stringify(paths);
    var content = `var FILES_TO_LOAD = ${filesToLoad};`;
    var file = new File({
      path: 'files.js',
      contents: new Buffer(content)
    });
    this.emit('data', file);

    var swContent = templates.SW_TPL_JS
      .replace('$VERSION', version)
      .replace('$HOOK', hookSW);
    var swFile = new File({
      path: 'sw.js',
      contents: new Buffer(swContent)
    });
    this.emit('data', swFile);

    // Copy library, check in different paths to support the example
    var swwPath = __dirname +
      '/node_modules/serviceworkers-ware/dist/sww.js';
    try {
      fs.accessSync(swwPath);
    } catch (e1) {
      // This is for the example
      swwPath = '../../node_modules/serviceworkers-ware/dist/sww.js';
      try {
        fs.accessSync(swwPath);
      } catch (e2) {
        // Check npm3 paths
        swwPath = __dirname + '/../serviceworkers-ware/dist/sww.js';
        try {
          fs.accessSync(swwPath);
        } catch (e3) {
          // This is a proper error
          throw new PluginError(PLUGIN_NAME, 'Cannot find SWW library');
        }
      }
    }

    var swwContent = fs.readFileSync(swwPath);
    var swwFile = new File({
      path: 'sww.js',
      contents: new Buffer(swwContent)
    });
    this.emit('data', swwFile);

    // Assets used by AppCache fall back
    if (paths.indexOf('install-sw.js') === -1) paths.push('install-sw.js');
    if (paths.indexOf('cache.html') === -1) paths.push('cache.html');
    if (paths.indexOf('cache.js') === -1) paths.push('cache.js');
    // Don't cache the manifest or the SW related files
    paths = paths.filter(function(file) {
      return file !== 'manifest.appcache'
        && file !== 'files.js'
        && file !== 'sw.js'
        && file !== 'sww.js';
    });
    var appCache = new AppCache.Generator(paths);
    var appCacheContent = appCache.generate();
    var appCacheManifest = new File({
      path: 'manifest.appcache',
      contents: new Buffer(appCacheContent)
    });
    this.emit('data', appCacheManifest);

    var iframeJSContent = templates.CACHE_TPL_JS;
    var iframeJSFile = new File({
      path: 'cache.js',
      contents: new Buffer(iframeJSContent)
    });
    this.emit('data', iframeJSFile);

    var appCacheHtmlContent = templates.CACHE_TPL_HTML;
    var appCacheHtmlFile = new File({
      path: 'cache.html',
      contents: new Buffer(appCacheHtmlContent)
    });
    this.emit('data', appCacheHtmlFile);

    this.emit('end');
  };

  return through(onFile, onEnd);
};
