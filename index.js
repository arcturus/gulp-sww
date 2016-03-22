var through = require('through');
var File = require('vinyl');
var templates = require('./templates.js');
var fs = require('fs');
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

    if (file.isBuffer() && path === 'index.html') {
      // Create the install file and append it's load
      var installFile = new File({
        path: 'install-sw.js',
        contents: new Buffer(templates.INSTALL_TEMPLATE)
      });
      this.emit('data', installFile);
      var content = String(file.contents);
      content = content.replace('</head>','<script src="install-sw.js"></script></head>');
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

    var swContent = templates.SW_TEMPLATE.replace('$VERSION', version).replace('$HOOK', hookSW);
    var swFile = new File({
      path: 'sw.js',
      contents: new Buffer(swContent)
    });
    this.emit('data', swFile);

    // Copy library, check in different paths to support the example
    var swwPath = __dirname +
      '/node_modules/serviceworkers-ware/dist/sww.js';
    try {
        fs.accessSync(swwPath)
    } catch(e1) {
      // This is for the example
      swwPath = '../../node_modules/serviceworkers-ware/dist/sww.js';
      try {
        fs.accessSync(swwPath);
      } catch(e2) {
        // This is a proper error
        throw new PluginError(PLUGIN_NAME, 'Cannot find SWW libary');
      }
    }

    var swwContent = fs.readFileSync(swwPath);
    var swwFile = new File({
      path: 'sww.js',
      contents: new Buffer(swwContent)
    });
    this.emit('data', swwFile);

    this.emit('end');
  };

  return through(onFile, onEnd);
};
