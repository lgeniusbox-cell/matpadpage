const KEY_EVENTS = new Set(['keydown', 'keyup']);
const orig = EventTarget.prototype.addEventListener;

EventTarget.prototype.addEventListener = function (type, listener, options) {
  if (KEY_EVENTS.has(type)&&!listener.toString().includes('handleKeyDownEvent')) {
    //console.log('blocked', type, this, listener);
    return;                       // never registered
  }
  return orig.call(this, type, listener, options);
};

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


if(!window.location.href?.includes('v=-')){
 window.location.href='https://www.youtube.com/tv/watch?v=-';
}
  
  window.captured = {
    api: [],        // RW/WW facade
    q3: [],         // inner player
    loader: [],     // i1/v1 streaming loader
    abr: [],        // uQa
    mediaSource: [],// NL
    mediaElement: [],// e4/y2
      more:[],
  };



  function classify(obj) {
    if (!obj || typeof obj !== "object" || seen.has(obj)) return;
    try {
      if (typeof obj.getPresentingPlayerType === "function" &&
          typeof obj.getVideoData === "function" &&
          typeof obj.loadVideoByPlayerVars === "function") {
        window.captured.api.push(obj);  return;
      }

     
    } catch (e) {}
  }

  const origApply = Function.prototype.apply;
  Function.prototype.apply = function (self, args) {
    try { if (self && typeof self === "object") classify(self); } catch (e) {}
    return origApply.call(this, self, args);
  };
  
Window.prototype.matenv = {};

var p = trustedTypes.createPolicy('js', {
    createScriptURL: url => url
});

Window.prototype.addScript= function addScript(u){
requestIdleCallback(()=>{

const script = document.createElement('script');
var existing = document.querySelector("script[nonce]");

script.setAttribute("nonce", existing.nonce);
script.src =p.createScriptURL(u);
document.head.appendChild(script);});
};

  Window.prototype.toDataURL =  async url => {
  const blob = await (await fetch(url)).blob();
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);   // "data:image/png;base64,...."
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
};


}).catch(console.error);
