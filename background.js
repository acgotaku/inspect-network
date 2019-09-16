let inspects = [];

async function getInspects() {
  const inspects = [];
  const tabList = await getConfig('tabList');
  for (const inspect of tabList) {
    const inspectDetail = await getConfig('inspect' + inspect);
    inspects.push(inspectDetail);
  }
  return inspects;
}

function getConfig(key) {
  return new Promise(function(resolve) {
    chrome.storage.local.get(key, items => {
      resolve(items[key]);
    });
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.method) {
    case 'updateInspects':
      getInspects().then(res => {
        inspects = res;
      });
      sendResponse(true);
      return true;
  }
});

(async () => {
  inspects = await getInspects();
  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      for (const inspect of inspects) {
        if (details.url.includes(inspect.URL)) {
          return {
            redirectUrl:
              'data:application/javascript;charset=utf-8,' +
              encodeURIComponent(inspect.replacedText)
          };
        }
      }
    },
    { urls: ['<all_urls>'] },
    ['blocking']
  );
})();
