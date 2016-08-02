importScripts('sww.js');

var version = '$VERSION';
var worker = new self.ServiceWorkerWare();
worker.use(new self.StaticCacher($FILES_TO_LOAD));
worker.use(new self.SimpleOfflineCache());

var extraFiles = $HOOK;
if (extraFiles.length) {
  importScripts(...extraFiles);
}

worker.init();
