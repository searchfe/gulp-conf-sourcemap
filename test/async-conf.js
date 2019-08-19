(function () {
            require.config({
              'paths': {"fetch":"static/async-polyfills/whatwg-fetch/fetch-0c21273fa3","Promise":"static/async-polyfills/promise-polyfill/lib/polyfill-df2641d375","Animation":"static/async-polyfills/@baidu/web-animations-js/web-animations-b8d80a74d8.min"}, shim: {"fetch":{"exports":["fetch"]},"Promise":{"exports":["Promise"]},"Animation":{"exports":["Animation"]}}
            });
          })();