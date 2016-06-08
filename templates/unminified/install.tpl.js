(function() {
  'use strict';

  if (location.protocol !== 'https:') {
    // navigator.serviceWorker and window.applicationCache are both defined in
    // http pages but will not work, so we need to check the URL scheme.
    return;
  }

  if ('serviceWorker' in navigator && !navigator.serviceWorker.controller) {
    navigator.serviceWorker.register('sw.js');
  } else if ('applicationCache' in window) {
    if (localStorage !== null) {
      if (localStorage.getItem('cached-by-gulp-sww') !== '1') {
        redirect();
      }
    } else if (location.hash !== '#no-redirect') {
      redirect();
    }
  }

  // Redirect to the page where the assets are being cached.
  function redirect() {
    var redirectUrl = encodeURIComponent(location.href);
    location.href = 'cache.html?redirect_url=' + redirectUrl;
  }
})();
