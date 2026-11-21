

async function waitForLocation(timeout = 10000) {
    const start = Date.now();

while (typeof window.location === "undefined") {
  return window.location;
    }

    while (Date.now() - start < timeout) {
        if (typeof window.location !== "undefined") {
            return window.location;
        }

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    throw new Error("window.location not available");
}

waitForLocation().then(location => {
  const KEY_EVENTS = new Set(['keydown', 'keyup']);
const orig = EventTarget.prototype.addEventListener;

EventTarget.prototype.addEventListener = function (type, listener, options) {
  if (KEY_EVENTS.has(type)&&!listener.toString().includes('handleKeyDownEvent')) {
    //console.log('blocked', type, this, listener);
    return;                       // never registered
  }
  return orig.call(this, type, listener, options);
};

    const overlay = document.createElement("div");
    overlay.id = "custom-overlay";

    Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.65)",
        zIndex: "2147483647",
        fontFamily: "Arial, sans-serif"
    });

    const box = document.createElement("div");

    Object.assign(box.style, {
        background: "#222",
        color: "#fff",
        padding: "30px 50px",
        borderRadius: "12px",
        fontSize: "20px",
        fontWeight: "bold",
        textAlign: "center",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
    });

    box.textContent = "Loading, please wait...";

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Optional: change text later
    window.updateOverlayText = function (text) {
        box.textContent = text;
    };

    // Optional: remove overlay
    window.removeOverlay = function () {
        overlay.remove();
    };

window.onerror = function (errorMessage, sourceUrl, lineNumber) {
  updateOverlayText("JS error: " + errorMessage + " (line " + lineNumber + ")");

     
      };


 


}).catch(console.error);
