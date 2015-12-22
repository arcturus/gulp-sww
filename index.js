var through = require('through');
var File = require('vinyl');
var templates = require('./templates.js');
var fs = require('fs');

var PLUGIN_NAME = 'gulp-sww';

module.exports = function(out, options) {
  options = options || {};

  var entryPoint = options.entryPoint || 'index.html';
  var version = options.version || '1.0.0';
  var paths = [];

  var onFile = function(file) {
    var path = file.path.replace(process.cwd() + '/', '');
    paths.push(path);

    if (file.isBuffer() && path === 'index.html') {
      var content = String(file.contents);
      content = content.replace('</head>',
        templates.INSTALL_TEMPLATE + '</head>');
      file.contents = new Buffer(content);
      this.push(file);
    }
  };

  var onEnd = function() {
    var filesToLoad = JSON.stringify(paths);
    var content = `var FILES_TO_LOAD = ${filesToLoad};`;
    var file = new File({
      path: out,
      contents: new Buffer(content)
    });
    this.emit('data', file);

    var swContent = templates.SW_TEMPLATE.replace('$VERSION', version);
    var swFile = new File({
      path: 'sw.js',
      contents: new Buffer(swContent)
    });
    this.emit('data', swFile);

    var swwContent = fs.readFileSync(
      'node_modules/serviceworkers-ware/dist/sww.js');
    var swwFile = new File({
      path: 'sww.js',
      contents: new Buffer(swwContent)
    });
    this.emit('data', swwFile);

    this.emit('end');
  };

  return through(onFile, onEnd);
};
