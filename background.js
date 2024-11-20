chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url && tab.url.includes("https://mail.superhuman.com/")) {
      chrome.storage.sync.get("noBackgroundEnabled", (data) => {
        if (data.noBackgroundEnabled) {
          // Inject CSS to hide the background and style the email display
          chrome.scripting.insertCSS({
            target: { tabId },
            css: `
              .Backdrop img {
                display: none !important;
              }
              .centered-email {
                position: fixed;
                top: 80%;
                left: 65px;
                font-size: 18px;
                font-family: Arial, sans-serif;
                color: #555;
                z-index: 9999;
              }
            `,
          });
  
          // Extract the email from the URL and display it
          chrome.scripting.executeScript({
            target: { tabId },
            func: injectEmailFromURL,
          });
        }
      });
    }
  });
  
  // Function to extract the email from the URL and display it
  function injectEmailFromURL() {
    const url = window.location.href;
    const emailMatch = url.match(/mail\.superhuman\.com\/([^/?#]+)/);
    if (emailMatch && emailMatch[1]) {
      const email = decodeURIComponent(emailMatch[1]);
      let existingElement = document.querySelector(".centered-email");
      if (!existingElement) {
        const emailDiv = document.createElement("div");
        emailDiv.className = "centered-email";
        emailDiv.textContent = email;
        document.body.appendChild(emailDiv);
      } else {
        existingElement.textContent = email; // Update if already exists
      }
    }
  }