// Popup functionality
document.addEventListener("DOMContentLoaded", async () => {
  // Load and display stats
  await updateStats();

  // Load auto-capture settings
  await loadAutoCaptureSettings();

  // Auto-capture toggle
  document
    .getElementById("autoCapture")
    .addEventListener("change", async (e) => {
      const enabled = e.target.checked;

      try {
        // Save setting
        await chrome.storage.local.set({
          autoCapture: {
            enabled: enabled,
            delay: 3000,
            minContentLength: 100,
          },
        });

        // Notify all content scripts
        const tabs = await chrome.tabs.query({});
        tabs.forEach((tab) => {
          chrome.tabs
            .sendMessage(tab.id, {
              action: "updateAutoCapture",
              settings: { enabled },
            })
            .catch(() => {
              // Ignore errors for tabs without content scripts
            });
        });

        showNotification(
          enabled ? "Auto-capture enabled!" : "Auto-capture disabled",
          "success"
        );
      } catch (error) {
        console.error("Error toggling auto-capture:", error);
        showNotification("Error updating settings", "error");
        e.target.checked = !enabled; // Revert
      }
    });

  // Capture Selection button
  document
    .getElementById("captureSelection")
    .addEventListener("click", async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      try {
        // Inject content script if not already injected
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"],
        });

        // Request selection capture
        chrome.tabs.sendMessage(
          tab.id,
          { action: "captureSelection" },
          (response) => {
            if (chrome.runtime.lastError) {
              showNotification("Please select some text first", "error");
            } else if (response && response.success) {
              showNotification("Selection captured successfully!", "success");
              updateStats();
            } else {
              showNotification("No text selected", "error");
            }
          }
        );
      } catch (error) {
        console.error("Error capturing selection:", error);
        showNotification("Error capturing selection", "error");
      }
    });

  // Capture Full Page button
  document.getElementById("capturePage").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    try {
      // Inject content script if not already injected
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });

      // Request full page capture
      chrome.tabs.sendMessage(tab.id, { action: "capturePage" }, (response) => {
        if (chrome.runtime.lastError) {
          showNotification("Error capturing page", "error");
        } else if (response && response.success) {
          showNotification("Page captured successfully!", "success");
          updateStats();
        } else {
          showNotification("Error capturing page", "error");
        }
      });
    } catch (error) {
      console.error("Error capturing page:", error);
      showNotification("Error capturing page", "error");
    }
  });

  // Add Note button
  document.getElementById("addNote").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const noteText = prompt("Enter your note:");

    if (noteText && noteText.trim()) {
      try {
        const noteData = {
          id: Date.now().toString(),
          type: "note",
          content: noteText.trim(),
          url: tab.url,
          title: tab.title,
          timestamp: new Date().toISOString(),
          tags: [],
          category: "note",
        };

        // Send to background for processing
        chrome.runtime.sendMessage(
          {
            action: "saveContent",
            data: noteData,
          },
          (response) => {
            if (response && response.success) {
              showNotification("Note saved successfully!", "success");
              updateStats();
            } else {
              showNotification("Error saving note", "error");
            }
          }
        );
      } catch (error) {
        console.error("Error saving note:", error);
        showNotification("Error saving note", "error");
      }
    }
  });

  // Open Dashboard button
  document.getElementById("openDashboard").addEventListener("click", () => {
    chrome.tabs.create({ url: "http://localhost:3001/dashboard" });
  });

  // Clear All Data button
  document.getElementById("clearData").addEventListener("click", async () => {
    const confirmed = confirm(
      "⚠️ WARNING: This will permanently delete ALL captured data including:\n\n" +
        "• All saved content and notes\n" +
        "• Browsing history\n" +
        "• Screenshots and thumbnails\n" +
        "• AI analysis data\n\n" +
        "This action CANNOT be undone!\n\n" +
        "Are you sure you want to continue?"
    );

    if (!confirmed) {
      return;
    }

    // Double confirmation for safety
    const doubleConfirm = confirm(
      "🔴 FINAL CONFIRMATION\n\n" +
        "Are you absolutely sure you want to delete everything?\n\n" +
        "Click OK to permanently delete all data.\n" +
        "Click Cancel to keep your data safe."
    );

    if (!doubleConfirm) {
      showNotification("Data deletion cancelled", "success");
      return;
    }

    try {
      // Clear all storage
      await chrome.storage.local.clear();

      // Reinitialize storage with empty values
      await chrome.storage.local.set({
        savedContent: [],
        screenshots: {},
        thumbnails: {},
        browsingHistory: [],
        aiAnalysis: {},
        activeTabs: {},
        storageStats: {
          bytesUsed: 0,
          itemCount: 0,
          lastUpdated: new Date().toISOString(),
        },
      });

      // Update the UI
      await updateStats();

      showNotification("✅ All data cleared successfully!", "success");

      console.log("All extension data has been cleared");
    } catch (error) {
      console.error("Error clearing data:", error);
      showNotification("❌ Error clearing data", "error");
    }
  });
});

// Load auto-capture settings
async function loadAutoCaptureSettings() {
  try {
    const result = await chrome.storage.local.get(["autoCapture"]);
    const autoCapture = result.autoCapture || { enabled: false };
    document.getElementById("autoCapture").checked = autoCapture.enabled;
  } catch (error) {
    console.error("Error loading auto-capture settings:", error);
  }
}

// Update statistics
async function updateStats() {
  try {
    const result = await chrome.storage.local.get([
      "savedContent",
      "storageStats",
    ]);
    const savedContent = result.savedContent || [];
    const stats = result.storageStats || { bytesUsed: 0 };

    document.getElementById("savedCount").textContent = savedContent.length;
    document.getElementById("storageUsed").textContent = (
      stats.bytesUsed /
      (1024 * 1024)
    ).toFixed(2);
  } catch (error) {
    console.error("Error updating stats:", error);
  }
}

// Show notification
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = `notification ${type}`;

  setTimeout(() => {
    notification.classList.add("hidden");
  }, 3000);
}
