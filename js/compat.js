
/* =====================================================================
   PART 1 : DEFINITIONS ONLY (nothing is executed here)
   ===================================================================== */
Window.prototype.disableKey = false;
Window.prototype.enableApp=true;
Window.prototype.cap = null;

Window.prototype.log = (...args)=>{
    if(window.boxdebug!==undefined){
    window.boxdebug.textContent=args.join(' | ');
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

Window.prototype.setupEnv=(e)=>{
    e.videoSelector = 'ytlr-player-container';
    e.bgVid = '8ZL4JXXfRMc';
    e.bgPs5 = 'l9VAOzSL6ec';
    e.browseId="UCOdTOUg4e9UH01s9KRe9FaQ";
    e.Success={};
    e.fn={};
    e.cap=null;
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
};
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
          window.log('config matenv........');
try{
    if (t.video == undefined || t.videoC == undefined||t.video == null|| t.videoC == null) {

        let videoC = document.querySelector('ytlr-player-container');
        if (videoC) {
            let video = document.querySelector('video');

            if (video) {
              setStyles(videoC, {
                    "z-index": "1000",
                });

               document.querySelectorAll('ytlr-player-container *').forEach(k=>{ 
                 setStyles(k, {
                    "z-index": "1"
                }); });
               
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
       window.log('failed to get video el');
        setTimeout(() => t.fn.cfgEnv(t), 100);
    }else{
       window.log('loading video');
        t.startBgVideo(t);
    }
} catch(e){window.log('error:',e.message)}
};
//setTimeout(cfgEnv(e),0);

e.preparReady=()=>{
Object.keys(e.fn).forEach(d=>{
    e.Success[d]=false;
});

};
e.init =()=>{
e.preparReady();
   window.log('init matenv');
setTimeout(()=>{e.fn.cfgEnv(e);},0);
}

e.startBgVideo=(t)=>{
    if(t.api!==undefined){

       try{
      t.api.loadVideoById(t.bgVid);
      t.api.setVolume(30);
       }catch{ }
    }else{
        setTimeout(()=>{
            t.startBgVideo(t);
        },100);
    }
}

};
/* =====================================================================
   PART 2 : STATE (needs the definitions above)
   ===================================================================== */

Window.prototype.matenv = {};
window.setupEnv(window.matenv);

///////////////////////////////////////////////////////////////////////////

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
       //window.log("updating start...");

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
    }
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
                     
                       setTimeout(() => {
            window.matenv.init();
        }, 1000);
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
   "height":"4vh",
   "width":"10vw",
  "background": "#222",
  "color": "white",
  "padding": "30px 50px",
  "border-radius": "12px",
  "font-size": "2vw",
  "font-weight": "bold",
  "text-align": "center",
  "box-shadow": "0 10px 40px rgba(0,0,0,0.5)"
});
window.boxdebug=box;

overlay.appendChild(box);
      //boxdebug.textContent = document.readyState;

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
     //startAssetUpdate();
    }else{
        setTimeout(()=>{preload();},0);
    }
 }catch(e){
         setTimeout(()=>{preload();},0);
    }
}





/* =====================================================================
   PART 3 : HOOKS AND START (everything they use is already defined)
   ===================================================================== */

    const original = constructor.constructor.prototype.call;

     constructor.constructor.prototype.call = function (...args) {
       //  let d = args.filter(e=>typeof e=='string');

      const h = args.filter(x=>x?.AdService!==undefined);
         if(h.length>0){
                        window.cap=h[0];
             setTimeout(()=>{
                 ping(false);
             },1000);
                        constructor.constructor.prototype.call=original;
                       }

        return original.apply(this, args);
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
if(window.enableApp){
preload();
}
