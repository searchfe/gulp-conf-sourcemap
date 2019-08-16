(function () {
    require.config({
      'paths': {"whatwg-fetch":"whatwg-fetch/fetch.js","polyfill":"./static/async-polyfills/@baidu/web-animations-js/web-animations-b8d80a74d8.min.js","@baidu/web-animations-js":"./static/async-polyfills/@baidu/web-animations-js/web-animations-b8d80a74d8.min.js"},
      shim: {"whatwg-fetch":{"exports":["whatwg-fetch"]},"polyfill":{"exports":["polyfill"]},"@baidu/web-animations-js":{"exports":["@baidu/web-animations-js"]}}
    });
  })();