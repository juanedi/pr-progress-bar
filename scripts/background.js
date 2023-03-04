chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message == "inject-css") {
    chrome.scripting.insertCSS({
      files: ["assets/pr-progress-bar.css"],
      target: { tabId: sender.tab.id },
    });
  }
});
