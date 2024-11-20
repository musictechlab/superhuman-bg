document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleNoBackground");

  // Load the saved state from storage
  chrome.storage.sync.get("noBackgroundEnabled", (data) => {
    toggle.checked = data.noBackgroundEnabled || false;
  });

  // Listen for toggle changes
  toggle.addEventListener("change", () => {
    const isEnabled = toggle.checked;

    // Save the new state
    chrome.storage.sync.set({ noBackgroundEnabled: isEnabled }, () => {
      console.log("No Background state updated:", isEnabled);
    });

    // Apply or remove the background CSS
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;

      if (isEnabled) {
        chrome.scripting.insertCSS({
          target: { tabId },
          css: `
            .Backdrop img {
              display: none !important;
            }
          `,
        });
      } else {
        chrome.scripting.removeCSS({
          target: { tabId },
          css: `
            .Backdrop img {
              display: none !important;
            }
          `,
        });
      }
    });
  });
});