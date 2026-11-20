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

if(!window.location.href?.includes('v=-')){
 //window.location.href='https://www.youtube.com/tv/watch?v=-';
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
function setupEnv(e){

    e.videoSelector = 'ytlr-player-container';
    e.bgVid = 'l9VAOzSL6ec';
    e.browseId="UCOdTOUg4e9UH01s9KRe9FaQ";
    e.Success={};
    e.fn={};
    e.bdReady=false;
    e.api =null;
    e.retry=3;
    e.bd={
    "context": {
        "client": {},
        "user": {
            "enableSafetyMode": false
        },
        "request": {
            "internalExperimentFlags": [],
            "consistencyTokenJars": []
        },
        "clickTracking": {}
    },
    "browseId": "VLPLZH_6y9FEcno"
};

e.notify =(t,d)=>{
if(t=='Error'){e.Success[d]=false;}else{e.Success[d]=true;}
}
e.fn.getPlaylist = (/*id*/ t,/*playlist*/ p,/*retry-count*/ r=3)=>{
      if(!e.Success['getReady']){return e.notify('Error','getPlaylist');}
      e.bd.browseId =t;
   fetch(`https://www.youtube.com/youtubei/v1/browse?prettyPrint=false`, {
  method: "POST",
  mode: "cors",
  credentials: "include",
  headers: {
    "accept": "*/*",
    "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
    "content-type": "application/json"
  },
  referrer: "https://www.youtube.com/tv/playlist",
  body: JSON.stringify(e.bd)
}).then(function (response) {
if (!response.ok) {if(r>0){setTimeout(e.fn.getPlaylist(t),2000);r--;}else{throw new Error("HTTP " + response.status);}}
    return response.json();
  })
  .then(function (data) {
    try{
 if(p=="playlist"){
  e.playlist= data.contents.tvBrowseRenderer.content.tvSurfaceContentRenderer.content.twoColumnRenderer.rightColumn.playlistVideoListRenderer.contents;
    }else{
        e.playlists=data.contents.tvBrowseRenderer.content.tvSurfaceContentRenderer.content.sectionListRenderer.contents[1].shelfRenderer.content.horizontalListRenderer.items;
    }
e.notify('success','getPlaylist');
    }catch{

    }

   })
  .catch(function (err) {
if(r>0){setTimeout(e.fn.getPlaylist(t),2000);r--;}
 });

};

e.fn.getReady = function(t){
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
                this._interceptUrl.includes('/v1/log_event?')) {
            if(!t.bdReady){
                try {
                    let payload = null;

                    if (typeof body === 'string') {
                        payload = JSON.parse(body);
                    }
                    t.bd.context.client = payload.context.client;
                    e.notify('succes','getReady');
                    t.bdReady=true;

                } catch (e) {
                    console.log('[player payload] error:', e);
                }}else{
    XMLHttpRequest.prototype.send= NATIVE_SEND;
    XMLHttpRequest.prototype.open= NATIVE_OPEN;
                }
            }
        } catch (e) {
            console.log('[XHR hook error]', e);
        }

        return NATIVE_SEND.apply(this, arguments);
    };
}

e.fn.cfgEnv =(t)=>{
    let cp =false;
    let videoC =document.querySelector('ytlr-player-container');
    cp = window?.captured?.api[0]?.state?.B!==undefined;
    if(cp){
    t.api = window.captured.api[0].state.B;
    t.apiInterface = t.api.getApiInterface();
    t.notify('success','cfgEnv');
        t.videoC=videoC;
       }
    cp=t.bdReady&&videoC!==undefined;

    if(cp){

    if(t.playlists==undefined&&e.retry>0){
        t.retry--;
        t.fn.getPlaylist('UCOdTOUg4e9UH01s9KRe9FaQ','playlists',t.retry);
    }
    if(videoC!==undefined&&videoC?.style!==undefined){
        videoC.style.setProperty('position', 'fixed', 'important');
        videoC.style.setProperty('z-index', '999999', 'important');
      const video = videoC.querySelector('video');
      if(video!==undefined){
          t.video=video;
           }
    }}
    cp=cp&&t.playlists!==undefined&&videoC!==undefined;
if(!cp){
    requestIdleCallback(()=>{t.fn.cfgEnv(t)});};
}
//setTimeout(cfgEnv(e),0);

e.preparReady=()=>{
Object.keys(e.fn).forEach(d=>{
    e.Success[d]=false;
});
};
e.updateApp= async ()=> {
    //showUpdateLoading(true);

    const events = new EventSource(
        "http://localhost:8765/update/progress"
    );

    events.onmessage = (event) => {
        const data = JSON.parse(event.data);

        //updateLoadingUI(data.progress, data.message);

        if (["completed", "up_to_date", "error"].includes(data.state)) {
            events.close();
            //showUpdateLoading(false);
        }
    };

    events.onerror = () => {
        console.error("Update progress connection lost");
    };

    try {
        const response = await fetch("http://localhost:8765/update", {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("Update request failed");
        }
    } catch (error) {
        events.close();
        showUpdateError(error.message);
    }
};
e.init =()=>{
e.preparReady();
 e.fn.getReady(e);
requestIdleCallback(()=>{e.fn.cfgEnv(e);});
}

e.startBgVideo=(t)=>{
 t.api?.cueVideoById(t.bgVid);
      t.api?.setVolume(30);
      t.api?.seekTo(100);
      t.api?.playVideo();
}

return true;
}

if(setupEnv(matenv)){
    matenv.init();
 matenv.updateApp();
}

function createApp(){
  function addCSS(href) {
  var existing = document.querySelector("style[nonce]");

 var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;

  link.setAttribute("nonce", existing.nonce);

  link.onload = function () { };
  link.onerror = function () { };

  (document.head || document.documentElement).appendChild(link);
  return link;
}

addCSS("http://localhost:8765/css/style.css");
const mathtml = `
       <div id="background-layers"></div>
    <div id="background-layers1"></div>
      <div class="indicater"></div>
      <div class="indicator up"><div class="ind-img"></div></div>

      <div class="header">
        <div class="h-l">
          <div class="p-logo"></div>
          <div class="pname"></div>
        </div>
        <div class="h-r">
          <div class="mat-state">Mat not connected</div>
          <div class="time">00:00</div>
          <div class="logo"></div>
        </div>
      </div>
      <div class="page">
        <div class="setTrack"></div>
        <div class="contenar main">
          <div class="loop-hint left">&larr; LEFT WRAPS TO LAST</div>
          <div class="loop-hint right">RIGHT WRAPS TO FIRST &rarr;</div>
        </div>
      </div>
      <div class="footer">
        <div class="settinglayout">
          <div class="button">Profiles</div>
          <div class="button">Settings</div>
          <div class="button pname">Adel</div>
          <div class="button">Playlist</div>
          <div class="button">Store</div>
        </div>
        <div class="description"></div>
      </div>
      <div class="indicator down"><div class="ind-img"></div></div>

      <div id="error-logger"></div>
`;
const App = document.createElement('div');
App.classList.add('stage');
App.style.setProperty('position', 'fixed', 'important');

App.style.setProperty('z-index', '9999999', 'important');
let html = mathtml;

if (window.trustedTypes && trustedTypes.createPolicy) {
  try {
   window.policy = trustedTypes.createPolicy('userscript-policy', {
      createHTML: s => s
    });
  } catch (e) {
    // Name not allowed by the page's CSP `trusted-types` list;
    // fall back to the defaultwindow.policy name if it's still free
    try {
     window.policy = trustedTypes.createPolicy('default', { createHTML: s => s });
    } catch (e2) {
     window.policy = null;
    }
  }
  if (policy) html =window.policy.createHTML(mathtml);
}

App.innerHTML = html;
document.body.appendChild(App);




addScript('http://localhost:8765/js/soundFX.js');


}
    createApp();


}).catch(console.error);
