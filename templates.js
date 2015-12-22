module.exports = {
  INSTALL_TEMPLATE: `<script>
    if (!navigator.serviceWorker) {
      return;
    }
    navigator.serviceWorker.register('sw.js');
  </script>`,
  SW_TEMPLATE: `importScripts('files.js');
  importScripts('sww.js');

  var version = '$VERSION';
  var worker = new self.ServiceWorkerWare();
  worker.use(new self.StaticCacher(FILES_TO_LOAD));
  worker.use(new self.SimpleOfflineCache());
  worker.init();`
};
