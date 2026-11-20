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

window.prototype.matenv = {};
matenv.location='https://www.youtube.com/tv/watch?v=-';
function checkLocation(e){
    if( window.location.href!==e){
        navigation.navigate(e)
      window.location.href=e;
    }
}
if(!window.location.href?.includes('v=-')){
checkLocation(matenv.location);}


}).catch(console.error);
