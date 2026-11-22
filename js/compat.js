function setupEnv(e){
    log('setup env..');
    e.videoSelector = 'ytlr-player-container';
    e.bgVid = 'l9VAOzSL6ec';
    e.browseId="UCOdTOUg4e9UH01s9KRe9FaQ";
    e.Success={};
    e.fn={};
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



e.fn.cfgEnv = (t) => {
    if (t.video == undefined || t.videoC == undefined||t.video == null|| t.videoC == null) {

        const videoC = document.querySelector('ytlr-player-container');
        if (videoC) {
            const video = document.querySelector('video');

            if (video) {
              setStyles(videoC, {
                    "z-index": "1000",
                });

               Array.from(document.querySelectorAll('ytlr-player-container *')).forEach(k=>{ setStyles(k, {
                    "z-index": "1"
                });
                                                                                           });
                  setStyles(video, {
                    "z-index": "1000"
                });
                t.video = video;
                t.videoC = videoC;
            }
        }
    }

    const retry = t.video == undefined|| t.videoC == undefined||t.video == null|| t.videoC == null;

    if (retry) {
        setTimeout(() => t.fn.cfgEnv(t), 100);
    }
};
//setTimeout(cfgEnv(e),0);

e.preparReady=()=>{
Object.keys(e.fn).forEach(d=>{
    e.Success[d]=false;
});

};
e.init =()=>{
e.preparReady();
setTimeout(()=>{e.fn.cfgEnv(e);},100);
}

e.startBgVideo=(t)=>{
    if(t.api!==undefined){
 t.api?.cueVideoById(t.bgVid);
      t.api?.setVolume(30);
      t.api?.seekTo(100);
      t.api?.playVideo();
    }else{
        setTimeout(()=>{
            t.startBgVideo(t);
        },100)
    }
}

return true;
}
Window.prototype.matenv = {};
setupEnv(matenv);

//debug::
function log(...args){
    if(window.boxdebug!==undefined){
    window.boxdebug.textContent=args.join(' | ');
      }
}
//override::
const KEY_EVENTS = new Set(['keydown', 'keyup']);
const orig = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function (type, listener, options) {
  if (KEY_EVENTS.has(type)&&!listener.toString().includes('handleKeyDownEvent')) {



      return;
  }
  return orig.call(this, type, listener, options);
};

Window.prototype.cap = [];
    const original = constructor.constructor.prototype.call;

     constructor.constructor.prototype.call = function (...args) {
         const d = args.filter(e=>typeof e=='string');

         if(d[0]=="NavigationService"){
             window.cap = args;
             window.capFull='full';
                                      }

        return original.apply(this, args);
    };

////////////

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

//////////////////////


//////////////////////

//init

Window.prototype.policy = null;



function prepare(){
window.jo ={};
if(typeof window.cap[0]?.AdService?.value?.Y?.j?.keys()=='object'){
        [...window.cap[0].AdService.value.Y.j.keys()].forEach((e,i)=>{
  window.jo[e] = [...[...window.cap[0].AdService.value.Y.j.values()][i].values()];
});

     const fn2 = window.cap[0].AdService.value.Y.j;
    log(fn2==undefined?'fn2 dont exist':'fn2 exist')
if(fn2!==undefined){
    if(window.matenv.api==undefined){
let ar = [...fn2];

ar.forEach((e,i)=>{
    ar[i]={[e[0]]:[...e[1]]};
})
ar.forEach((e)=>{
    Object.values(e).forEach(t=>{
        t.forEach((i)=>{
             if( i[1]?.context?.pendingLoadVideo?.Ah!==undefined){
           window.matenv.api = i[1].context.pendingLoadVideo?.Ah[0];
       }
        });
 });
});
    }
    let p=false;
Object.keys(window.jo).forEach(e=>{
    if(!p){
    const fn =window.jo[e][0]?.context?.J?.UE?.constructor?.prototype?.set;


    if(typeof fn==='function'){
        p=true;
        window.pre=true;
        const adSet = window.jo[e][0].context.J.UE.constructor.prototype.set;
         window.jo[e][0].context.J.UE.constructor.prototype.set=function (...args) {

    if(args[0]?.airingStart===undefined&&typeof args[0]=='object'&&typeof args[0]?.skip=='function'){

args[0]?.skip();

    }

    return adSet.apply(this,args);

    }
}


    }
  });
}

}
    let retry = window.matenv.api==undefined||window.pre==undefined;
if(retry){setTimeout(()=>{prepare();},100);}else{

    matenv.init();
}
}

function setStyles(el, styles) {
  if(el!==undefined){
  for (var prop in styles) {
    if (styles.hasOwnProperty(prop)) {
      el.style.setProperty(prop, styles[prop], 'important');
    }
  }}
}

if (window.trustedTypes && window.trustedTypes.createPolicy) {
Window.prototype.p = trustedTypes.createPolicy('js', {
    createScriptURL: url => url
});


Window.prototype.addScript =(u)=>{
setTimeout(()=>{

const script = document.createElement('script');
var existing = document.querySelector("script[nonce]");

script.setAttribute("nonce", existing.nonce);
script.src =p.createScriptURL(u);
document.head.appendChild(script);
},100);
}
   }else{
     Window.prototype.addScript =(u)=>{
setTimeout(()=>{

const script = document.createElement('script');
var existing = document.querySelector("script[nonce]");
if(existing){
script.setAttribute("nonce", existing.nonce);
}
script.src =u;
document.head.appendChild(script);
},1000);
}
}

Window.prototype.addCSS = (href)=> {
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





Window.prototype.startAssetUpdate = async ()=> {
    try {
       // log("updating start...");

        // Connect to progress stream first
        const response = await fetch(
            "http://127.0.0.1:8765/update/progress"
        );

        if (!response.ok || !response.body) {
            //log("Progress connection failed");
            throw new Error("Progress connection failed");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Start synchronization
        const updateRequest = fetch(
            "http://127.0.0.1:8765/update",
            { method: "POST" }
        );

        let buffer = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const events = buffer.split("\n\n");
            buffer = events.pop();

            for (const event of events) {
                const line = event
                    .split("\n")
                    .find(line => line.startsWith("data:"));

                if (!line) continue;

                const data = JSON.parse(line.substring(5).trim());

                //log(data.progress, data.message);

                if (["completed", "up_to_date", "error"].includes(data.state)) {
                    reader.cancel();

                    if (data.state !== "error") {
                        //addScript("http://127.0.0.1:8765/js/test.js");
                    }

                    return;
                }
            }
        }

        await updateRequest;

    } catch (error) {
        log(error.message);
    }
}


 function preload(){try{
    let p= typeof document.createElement == 'function';
    p= typeof document.body == 'object';
    if(p){


Array.from(document.querySelectorAll('body *')).forEach((e)=>{
setStyles(e, {
  "z-index":"-1"
});
});

var overlay = document.createElement("div");
overlay.id = "custom-overlay";



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
window.boxdebug=box;

overlay.appendChild(box);
      boxdebug.textContent = document.readyState;

document.body.appendChild(overlay);
setStyles(overlay, {
  "position": "fixed",
  "top":"0",
  "left": "0",
  "width": "100vw",
  "height": "100vh",
  "display": "flex",
  "align-items": "center",
  "justify-content": "center",
  "background": "rgba(0, 0, 0, 0.3)",
  "z-index": "99999999999 !important"

});


    // Optional: change text later
    window.updateOverlayText = function (text) {
        box.textContent = text;
    };

    // Optional: remove overlay
    window.removeOverlay = function () {
        overlay.remove();
    };
prepare();
     //startAssetUpdate();
    }else{
        setTimeout(()=>{preload();},0);
    }
 }catch(e){
         setTimeout(()=>{preload();},0);
    }
}

preload();
