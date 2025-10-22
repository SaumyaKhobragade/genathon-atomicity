// This script runs in the page context (injected by bridge.js content script)
// It exposes the extension API to the webpage

(function () {
  "use strict";

  // Get extension ID from script data attribute
  const script = document.currentScript;
  const EXTENSION_ID = script ? script.dataset.extensionId : "";

  window.memoryLaneExtension = {
    extensionId: EXTENSION_ID,

    getSavedContent: async function () {
      return new Promise((resolve) => {
        window.postMessage(
          {
            type: "EXTENSION_REQUEST",
            action: "getSavedContent",
          },
          "*"
        );

        const handler = (event) => {
          if (
            event.data.type === "EXTENSION_RESPONSE" &&
            event.data.action === "getSavedContent"
          ) {
            window.removeEventListener("message", handler);
            resolve(event.data.response);
          }
        };
        window.addEventListener("message", handler);
      });
    },

    getStats: async function () {
      return new Promise((resolve) => {
        window.postMessage(
          {
            type: "EXTENSION_REQUEST",
            action: "getStats",
          },
          "*"
        );

        const handler = (event) => {
          if (
            event.data.type === "EXTENSION_RESPONSE" &&
            event.data.action === "getStats"
          ) {
            window.removeEventListener("message", handler);
            resolve(event.data.response);
          }
        };
        window.addEventListener("message", handler);
      });
    },

    getAllData: async function () {
      return new Promise((resolve) => {
        window.postMessage(
          {
            type: "EXTENSION_REQUEST",
            action: "getData",
          },
          "*"
        );

        const handler = (event) => {
          if (
            event.data.type === "EXTENSION_RESPONSE" &&
            event.data.action === "getData"
          ) {
            window.removeEventListener("message", handler);
            resolve(event.data.response);
          }
        };
        window.addEventListener("message", handler);
      });
    },

    onStorageChange: function (callback) {
      window.addEventListener("message", (event) => {
        if (event.data.type === "EXTENSION_STORAGE_CHANGE") {
          callback(event.data.changes);
        }
      });
    },

    sendMessage: async function (action, data = {}) {
      return new Promise((resolve) => {
        window.postMessage(
          {
            type: "EXTENSION_REQUEST",
            action: action,
            ...data,
          },
          "*"
        );

        const handler = (event) => {
          if (
            event.data.type === "EXTENSION_RESPONSE" &&
            event.data.action === action
          ) {
            window.removeEventListener("message", handler);
            resolve(event.data.response);
          }
        };
        window.addEventListener("message", handler);

        // Timeout after 10 seconds
        setTimeout(() => {
          window.removeEventListener("message", handler);
          resolve({ success: false, error: "Request timeout" });
        }, 10000);
      });
    },

    isAvailable: function () {
      return true;
    },
  };

  window.dispatchEvent(
    new CustomEvent("memoryLaneExtensionReady", {
      detail: { extensionId: EXTENSION_ID },
    })
  );

  console.log("Sparky Extension bridge ready, ID:", EXTENSION_ID);
})();
