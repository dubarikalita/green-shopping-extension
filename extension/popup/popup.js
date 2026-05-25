// popup.js — runs when the user opens the extension popup

// ── On load: check what page the user is currently on ────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const url = tab?.url || "";

    const dot      = document.getElementById("status-dot");
    const text     = document.getElementById("status-text");
    const scoreRow = document.getElementById("score-row");

    if (url.includes("amazon.in") || url.includes("amazon.com")) {

      // Check if we're on a product page specifically
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: () => {
            const titleEl  = document.getElementById("productTitle");
            const sidebarEl = document.getElementById("green-assistant-sidebar");
            const scoreEl  = sidebarEl?.querySelector(".ga-score-circle");
            return {
              isProduct: !!titleEl,
              title:     titleEl?.innerText?.trim().slice(0, 50) || "",
              score:     scoreEl?.innerText?.trim() || null,
              hasSidebar: !!sidebarEl,
            };
          },
        },
        (results) => {
          const data = results?.[0]?.result;

          if (data?.isProduct) {
            dot.className  = "status-dot active";
            text.innerHTML = `<strong>Product page detected</strong><br>${data.title}...`;

            if (data.score) {
              scoreRow.style.display = "flex";
              const bubble   = document.getElementById("score-bubble");
              const title    = document.getElementById("score-title");
              const subtitle = document.getElementById("score-subtitle");

              const s = parseInt(data.score);
              bubble.textContent   = s;
              bubble.style.background = s >= 70 ? "#16a34a"
                                      : s >= 50 ? "#65a30d"
                                      : s >= 30 ? "#d97706"
                                      : "#dc2626";
              title.textContent    = s >= 70 ? "Excellent"
                                   : s >= 50 ? "Good"
                                   : s >= 30 ? "Moderate"
                                   : "Poor";
              subtitle.textContent = "Sustainability score";
            }

          } else {
            dot.className  = "status-dot warning";
            text.textContent = "On Amazon but not a product page. Navigate to a product to see its score.";
          }
        }
      );

    } else {
      dot.className  = "status-dot inactive";
      text.textContent = "Not on a supported site. Visit Amazon to get started.";
    }
  });

  // ── Button: show/re-inject sidebar ────────────────────────────────────────
  document.getElementById("btn-open-sidebar").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          const sidebar = document.getElementById("green-assistant-sidebar");
          const tab     = document.getElementById("ga-toggle-tab");
          if (sidebar) {
            sidebar.classList.remove("hidden");
            if (tab) tab.style.display = "none";
          }
        },
      });
    });
    window.close(); // close the popup after clicking
  });

  // ── Button: open Amazon sustainable search ─────────────────────────────────
  document.getElementById("btn-amazon").addEventListener("click", () => {
    chrome.tabs.create({
      url: "https://www.amazon.in/s?k=sustainable+eco+friendly+products"
    });
  });
});