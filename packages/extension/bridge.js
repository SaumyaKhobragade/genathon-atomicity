// Bridge script to expose extension data to webpage via content script
// This runs in the content script context and can communicate with the background script

(function () {
  "use strict";

  if (!chrome || !chrome.runtime) {
    console.error("Chrome runtime not available in bridge");
    return;
  }

  const EXTENSION_ID = chrome.runtime.id;

  // Inject the bridge script into the page context
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("bridge-injected.js");
  script.dataset.extensionId = EXTENSION_ID;
  (document.head || document.documentElement).appendChild(script);
  script.onload = () => script.remove();

  // Listen for messages from the page and forward to extension
  window.addEventListener("message", async (event) => {
    if (event.source !== window || event.data.type !== "EXTENSION_REQUEST") {
      return;
    }

    const { action, ...data } = event.data;

    try {
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ action, ...data }, (response) => {
          if (chrome.runtime.lastError) {
            resolve({
              success: false,
              error: chrome.runtime.lastError.message,
            });
          } else {
            resolve(response);
          }
        });
      });

      window.postMessage(
        {
          type: "EXTENSION_RESPONSE",
          action,
          response,
        },
        "*"
      );
    } catch (error) {
      window.postMessage(
        {
          type: "EXTENSION_RESPONSE",
          action,
          response: { success: false, error: error.message },
        },
        "*"
      );
    }
  });

  // Listen for storage changes and forward to page
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local") {
      window.postMessage(
        {
          type: "EXTENSION_STORAGE_CHANGE",
          changes,
        },
        "*"
      );
    }
  });

  console.log("Sparky Extension bridge content script loaded");
})();
