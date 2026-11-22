
const KEY_EVENTS = new Set(['keydown', 'keyup']);
const orig = EventTarget.prototype.addEventListener;
let b = false;
EventTarget.prototype.addEventListener = function (type, listener, options) {
  if (KEY_EVENTS.has(type)&&!listener.toString().includes('handleKeyDownEvent')) {
      if(!b){ b=true;
             

function preload(){try{
    let p= typeof document?.createElement == 'function';
    p= typeof document?.body == 'object';
    if(p){
  
function setStyles(el, styles) {
  for (var prop in styles) {
    if (styles.hasOwnProperty(prop)) {
      el.style.setProperty(prop, styles[prop], 'important');
    }
  }
}

var overlay = document.createElement("div");
overlay.id = "custom-overlay";

setStyles(overlay, {
  "position": "fixed",
  "top": "0",
  "left": "0",
  "width": "100vw",
  "height": "100vh",
  "display": "flex",
  "align-items": "center",
  "justify-content": "center",
  "background": "rgba(0, 0, 0, 0.65)",
  "z-index": "99999999999",
  "font-family": "Arial, sans-serif"
});

var box = document.createElement("div");

setStyles(box, {
  "background": "#222",
  "color": "#fff",
  "padding": "30px 50px",
  "border-radius": "12px",
  "font-size": "20px",
  "font-weight": "bold",
  "text-align": "center",
  "box-shadow": "0 10px 40px rgba(0,0,0,0.5)"
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



    }else{
        setTimeout(()=>{preload();},100);
    }}catch(e){
         setTimeout(()=>{preload();},100);

        document?.querySelectorAll('yt-formatted-string')[0]?.textContent="JS error: " + e.message;

    }
}

window.onerror = function (errorMessage, sourceUrl, lineNumber) {
    document?.querySelectorAll('yt-formatted-string')[0]?.textContent="JS error: " + errorMessage + " (line " + lineNumber + ")"

      };


             setTimeout(()=>{preload();},100);}
      return;                     
  }
  return orig.call(this, type, listener, options);
};


