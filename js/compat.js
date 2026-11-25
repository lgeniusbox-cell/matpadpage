Window.prototype.disableKey = true;
Window.prototype.enableApp=true;
Window.prototype.dbg=true;
Window.prototype.browser = function(b){Window.prototype.disableKey=!b;Window.prototype.enableApp=!b;};
//window.browser(false);
/////////////////////////////////
Window.prototype.firstInstance=false;
Window.prototype.cap = null;
Window.prototype.storeLogs=[];
Window.prototype.matenv = {};

Window.prototype.path=['originalCons','debugOv','ping','addScript'];

Window.prototype.addScript =(u)=>{
setTimeout(()=>{

const script = document.createElement('script');
var existing = document.querySelector("script[nonce]");
if(existing){
script.setAttribute("nonce", existing.nonce);
}
script.src =u;
document.body.appendChild(script);
},1000);
}

function extractVariable(str) {
    return str.match(/this\.([a-zA-Z_$][\w$]*)\.on\(/)?.[1] || null;
}

function ping(pr = false) {

    let pp = pr;

    if (!pp) {
        Object.values(window.cap.AdService.value).forEach((f) => {
            try {
                let ue = '';

                if (f.onIsAdActiveChange !== undefined) {
                    ue = extractVariable(f.onIsAdActiveChange.toString());
                }

                if (ue.length > 0) {
                    const fn = f[ue].constructor.prototype.set;

                    if (typeof fn === 'function') {
                        pp = true;

                        const adSet = f[ue].constructor.prototype.set;

                        f[ue].constructor.prototype.set = function (...args) {

                            if (
                                args[0]?.airingStart === undefined &&
                                typeof args[0] == 'object' &&
                                typeof args[0]?.skip == 'function'
                            ) {
                                args[0]?.skip();
                            }

                            return adSet.apply(this, args);
                        };
                    }
                }
            } catch {}
        });
    }


    if (window.matenv.api==undefined&&pp) {
        Object.values(window.cap.AdService.value).forEach((f) => {
            try {
                if (f.waitForPlayerReady !== undefined) {
                    f.waitForPlayerReady().then(p=>{
window.matenv.api = p;
                       p.pauseVideo();
                       p.setVolume(5); 
                       setTimeout(() => {
            window.addScript('http://localhost:8765/js/init.js');
        }, 0);
});
                   }
            } catch {}
        });
    }

    if (!pp) {
       return setTimeout(() => {
        ping(pp);
    }, 1000);
    }


}


/* =====================================================================
   PART 3 : HOOKS AND START (everything they use is already defined)
   ===================================================================== */

    const originalCons = constructor.constructor.prototype.call;

     constructor.constructor.prototype.call = function (...args) {
  if(!window.firstInstance&&document?.body){
    window.firstInstance=true;
    document.body.style.visibility ='hidden !important';
    }
      const h = args.filter(x=>x?.AdService!==undefined);
         if(h.length>0){
                        window.cap=h[0];
             setTimeout(()=>{
                 window.ping();
             },0);

                        constructor.constructor.prototype.call=originalCons;
                       }

        return originalCons.apply(this, args);
    };

const NATIVE_OPEN = XMLHttpRequest.prototype.open;
const NATIVE_SEND = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function (method, url) {
        this._interceptUrl = url;
        this._interceptMethod = method;

        return NATIVE_OPEN.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {

        try {
            if (this._interceptUrl &&
                this._interceptUrl.includes('/youtubei/')) {
            if(window.bdPayload==undefined){
                try {
                    let payload = null;

                    if (typeof body === 'string') {
                        payload = JSON.parse(body);
                    }
                    window.bdPayload = payload.context.client;


                } catch (e) {
                }
            }else{
    XMLHttpRequest.prototype.send= NATIVE_SEND;
    XMLHttpRequest.prototype.open= NATIVE_OPEN;
                }
            }
        } catch (e) {

        }

        return NATIVE_SEND.apply(this, arguments);
    };

const KEY_EVENTS = new Set(['keydown', 'keyup']);
const orig = EventTarget.prototype.addEventListener;

EventTarget.prototype.addEventListener = function (type, listener, options) {
  if (window.disableKey&&KEY_EVENTS.has(type)&&!listener.toString().includes('handleKeyDownEvent')) {
    return;
  }
  return orig.call(this, type, listener, options);
};
