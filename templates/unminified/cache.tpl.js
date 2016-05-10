(function() {
  'use strict';

  if (!('URLSearchParams' in window)) {
    // Simple polyfill for URLSearchParams#has() and URLSearchParams#get().
    class URLSearchParamsPolyfill {
      constructor(queryString) {
        this._queryString = queryString
        // Split on all `&`.
          .split('&')
          // Split each string on the first `=` sign.
          .map((string) => {
            const i = string.indexOf('=');

            if (i === -1) {
              return [string, ''];
            }

            return [string.substring(0, i), string.substring(i + 1)];
          });
      }

      has(key) {
        return this._queryString.some((string) => string[0] === key);
      }

      get(key) {
        let val = null;

        this._queryString.some((string) => {
          if (string[0] === key) {
            val = string[1];
            return true;
          }
          return false;
        });

        if (val === null) {
          return null;
        }

        return decodeURIComponent(val);
      }
    }

    window.URLSearchParams = URLSearchParamsPolyfill;
  }

  if (location.protocol !== 'https:' || 'serviceWorker' in navigator) {
    return redirect();
  }

  // @see https://github.com/matthew-andrews/workshop-making-it-work-offline/tree/master/05-offline-news/04-more-hacking-appcache
  let checkTimer = null;
  let loopMax = 10;

  function checkNow() {
    /*
      0 UNCACHED
      1 IDLE
      2 CHECKING
      3 DOWNLOADING
      4 UPDATEREADY
      5 OBSOLETE
    */
    if (applicationCache.status === 2 /* CHECKING */
      || applicationCache.status === 3 /* DOWNLOADING */
      || applicationCache.status === 4 /* UPDATEREADY */
      || applicationCache.status === 5 /* OBSOLETE */) {
      redirect();
    }

    if (loopMax--) {
      checkIn(1000);
    } else {
      redirect();
    }
  }

  function checkIn(ms) {
    if (checkTimer) {
      clearTimeout(checkTimer);
    }

    checkTimer = setTimeout(checkNow, ms);
  }

  function redirect() {
    const searchParams = new URLSearchParams(location.search.substring(1));
    // By default, go to the default page in the current folder.
    // pathname
    let url = new URL(location.href);
    url.pathname = url.pathname.replace(/cache\.html$/, '/');

    if (searchParams.has('debug')) {
      return;
    }

    if (searchParams.has('redirect_url')) {
      // A param can be an empty string, so defaulting to the value of url.
      url = new URL(searchParams.get('redirect_url') || url);
    }

    if (localStorage !== null) {
      // Use localStorage to avoid infinite redirections.
      localStorage.setItem('cached-by-gulp-sww', '1');
    } else {
      // If localStorage can't be used, we fallback to a hash in the URL.
      url.hash = '#no-redirect';
    }

    location.href = url.href;
  }

  applicationCache.addEventListener('cached', redirect);
  applicationCache.addEventListener('checking', checkNow);
  applicationCache.addEventListener('downloading', checkNow);
  applicationCache.addEventListener('error', redirect);
  applicationCache.addEventListener('noupdate', redirect);
  applicationCache.addEventListener('obsolete', redirect);
  applicationCache.addEventListener('progress', checkNow);
  applicationCache.addEventListener('updateready', redirect);

  checkIn(250);
}());
