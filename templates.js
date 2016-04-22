module.exports = {
  INSTALL_TEMPLATE: `navigator.serviceWorker&&!navigator.serviceWorker.controller&&navigator.serviceWorker.register('sw.js')`,
  SW_TEMPLATE: `importScripts('files.js');
  importScripts('sww.js');

  var version = '$VERSION';
  var worker = new self.ServiceWorkerWare();
  worker.use(new self.StaticCacher(FILES_TO_LOAD));
  worker.use(new self.SimpleOfflineCache());

  var extraFile = '$HOOK';
  if (extraFile && extraFile !== 'null') {
    importScripts(extraFile);
  }

  worker.init();`
};
