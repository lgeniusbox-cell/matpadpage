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
