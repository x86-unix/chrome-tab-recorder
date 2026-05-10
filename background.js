let isRecording = false;

chrome.action.onClicked.addListener(() => {
  if (isRecording) return;
  chrome.tabs.create({ url: chrome.runtime.getURL("recorder.html") });
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "setIcon") {
    isRecording = msg.recording;
    chrome.action.setIcon({
      path: msg.recording
        ? "icons/icon-recording.png"
        : "icons/icon-default.png"
    });
  }
});
