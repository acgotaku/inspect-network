let inspects = [];

async function getInspects() {
  const inspects = [];
  const tabList = await getConfig('tabList');
  if (tabList) {
    for (const inspect of tabList) {
      const inspectDetail = await getConfig('inspect' + inspect);
      inspects.push(inspectDetail);
    }
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

function stringMatch(str, match) {
  return str.includes(match);
}

function wildcardMatch(str, match) {
  return new RegExp(
    '^' +
      encodeURIComponent(match)
        .split('*')
        .join('.*') +
      '$'
  ).test(encodeURIComponent(str));
}

function regexMatch(str, match) {
  return new RegExp(match).test(str);
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
        let isMatched = false;
        switch (inspect.matchMode) {
          case 'match':
            isMatched = stringMatch(details.url, inspect.URL);
            break;
          case 'wildcard':
            isMatched = wildcardMatch(details.url, inspect.URL);
            break;
          case 'regex':
            isMatched = regexMatch(details.url, inspect.URL);
        }
        if (isMatched && inspect.URL) {
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
