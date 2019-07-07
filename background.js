chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url === localStorage.getItem('URL')) {
      return {
        redirectUrl:
          'data:application/javascript;charset=utf-8,' +
          encodeURIComponent(localStorage.getItem('text'))
      };
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);
