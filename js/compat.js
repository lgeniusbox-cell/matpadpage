/* =====================================================================
   PART 1 : DEFINITIONS ONLY (nothing is executed here)
   ===================================================================== */

Window.prototype.disableKey = false;
Window.prototype.enableApp=true;
Window.prototype.dbg=true;

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
try{
    if (t.video == undefined || t.videoC == undefined||t.video == null|| t.videoC == null) {

        let videoC = document.querySelector('ytlr-player-container');
        if (videoC) {
            let video = document.querySelector('video');

            if (video) {
               if(window.enableApp){
              setStyles(videoC, {
                    "z-index": "1000",
                });

               Array.from(document.querySelectorAll('ytlr-player-container *')).forEach(k=>{ 
                 setStyles(k, {
                    "z-index": "1"
                }); });
               
                  setStyles(video, {
                    "z-index": "1000"
                });}
                t.video = video;
                t.videoC = videoC;
            }
        }
    }

    const retry = t.video == undefined|| t.videoC == undefined||t.video == null|| t.videoC == null;
     
    if (retry) {
        setTimeout(() => t.fn.cfgEnv(t), 100);
    }else{
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
setTimeout(()=>{e.fn.cfgEnv(e);},0);
}

e.startBgVideo=(t)=>{
    if(t.api!==undefined||!window.location.href.includes(t.bgVid)){
       try{
      t.api.loadVideoById(t.bgVid);
      t.api.playVideo();    
      t.api.setVolume(30);
       }catch{ }
       //document.body.style.visibility = 'visible !important';
       setTimeout(()=>{ window.startAssetUpdate().then(e=>{    window.createApp();      });      },1000);
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
//document.body.style.visibility = 'hidden !important';
///////////////////////////////////////////////////////////////////////////

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

Window.prototype.addCSS = (url) => {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("CSS HTTP " + response.status);
            }

            return response.text();
        })
        .then(css => {
            // var style = document.createElement("style");
            var existing = document.querySelector("style[nonce]");

            if (existing) {
               // style.setAttribute("nonce", existing.nonce);
               existing.textContent+=css;
            }
          // style.setAttribute("type","text/css");
           //style.setAttribute("data-late-css","");
           // style.textContent = css;
           //style.onload=function(e){ window.log("CSS loaded:");}
           //style.onerror=function(e){ window.log("CSS error:",e.message);}              
            //window.log(typeof  document.documentElement);
            //document.documentElement.appendChild(style);
            
            return window.log('css success');
        })
        .catch(error => {
            window.addCSS(url);
        });
};

Window.prototype.startAssetUpdate = async (check = false) => {
    try {
        if (check) {
            const response = await fetch(
                "http://127.0.0.1:8765/update/check"
            );

            if (!response.ok)
                throw new Error("Update check failed");

            return await response.json();
        }

        const response = await fetch(
            "http://127.0.0.1:8765/update/progress"
        );

        if (!response.ok || !response.body)
            throw new Error("Progress connection failed");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const updateRequest = await fetch(
            "http://127.0.0.1:8765/update",
            { method: "POST" }
        );

        if (!updateRequest.ok)
            throw new Error("Update request failed");

        let buffer = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const events = buffer.split("\n\n");
            buffer = events.pop();

            for (const event of events) {
                const line = event.split("\n").find(
                    line => line.startsWith("data:")
                );

                if (!line) continue;

                const data = JSON.parse(line.substring(5).trim());
window.log(
    data.state,
    data.progress + "%",
    data.message
);
                if (["completed", "up_to_date", "error"].includes(data.state)) {
                    await reader.cancel();
                    return data;
                }
            }
        }

    } catch (error) {
        window.log(error.stack || error.message);
        return { state: "error", message: error.message };
    }
};
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


window.createHTML = function (html, parent) {
    var root = document.createElement("div");
    var stack = [root];
    var i = 0;

    var voidTags = {
        area: 1, base: 1, br: 1, col: 1,
        embed: 1, hr: 1, img: 1, input: 1,
        link: 1, meta: 1, param: 1, source: 1,
        track: 1, wbr: 1
    };

    function decodeEntities(text) {
        return text.replace(
            /&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp|larr|rarr);/gi,
            function (match, entity) {
                var named = {
                    amp: "&",
                    lt: "<",
                    gt: ">",
                    quot: '"',
                    apos: "'",
                    nbsp: "\u00A0",
                    larr: "\u2190",
                    rarr: "\u2192"
                };

                if (entity.charAt(0) === "#") {
                    var code = entity.charAt(1).toLowerCase() === "x"
                        ? parseInt(entity.substring(2), 16)
                        : parseInt(entity.substring(1), 10);

                    if (code > 0 && code <= 0x10FFFF) {
                        return String.fromCodePoint(code);
                    }

                    return match;
                }

                return named[entity.toLowerCase()] || match;
            }
        );
    }

    function parseAttributes(element, source) {
        var regex = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
        var match;

        while ((match = regex.exec(source)) !== null) {
            var name = match[1];
            var value = match[2] !== undefined ? match[2] :
                        match[3] !== undefined ? match[3] :
                        match[4] !== undefined ? match[4] : "";

            if (/^on/i.test(name)) continue;

            element.setAttribute(name, decodeEntities(value));
        }
    }

    function readTag() {
        var start = i;
        var quote = null;

        while (i < html.length) {
            var c = html.charAt(i);

            if (quote) {
                if (c === quote) quote = null;
            } else {
                if (c === '"' || c === "'") {
                    quote = c;
                } else if (c === ">") {
                    i++;
                    return html.substring(start + 1, i - 1);
                }
            }

            i++;
        }

        return null;
    }

    while (i < html.length) {
        var current = stack[stack.length - 1];

        // Comment
        if (html.substring(i, i + 4) === "<!--") {
            var commentEnd = html.indexOf("-->", i + 4);
            i = commentEnd === -1 ? html.length : commentEnd + 3;
            continue;
        }

        // Text
        if (html.charAt(i) !== "<") {
            var nextTag = html.indexOf("<", i);
            if (nextTag === -1) nextTag = html.length;

            var text = html.substring(i, nextTag);

            if (text) {
                current.appendChild(
                    document.createTextNode(decodeEntities(text))
                );
            }

            i = nextTag;
            continue;
        }

        // Closing tag
        if (html.charAt(i + 1) === "/") {
            i += 2;

            var closeEnd = html.indexOf(">", i);
            if (closeEnd === -1) break;

            var closeName = html.substring(i, closeEnd)
                .trim().split(/\s/)[0].toLowerCase();

            for (var s = stack.length - 1; s > 0; s--) {
                if (stack[s].tagName.toLowerCase() === closeName) {
                    stack.length = s;
                    break;
                }
            }

            i = closeEnd + 1;
            continue;
        }

        // Opening tag
        if (/[a-zA-Z]/.test(html.charAt(i + 1))) {
            var tagContent = readTag();
            if (tagContent === null) break;

            var selfClosing = /\/\s*$/.test(tagContent);
            tagContent = tagContent.replace(/\/\s*$/, "");

            var nameMatch = tagContent.match(/^([^\s/>]+)/);
            if (!nameMatch) continue;

            var tagName = nameMatch[1].toLowerCase();
            var attrSource = tagContent.substring(nameMatch[0].length);

            var element = document.createElement(tagName);

            parseAttributes(element, attrSource);

            current.appendChild(element);

            if (!selfClosing && !voidTags[tagName]) {
                stack.push(element);
            }

            continue;
        }

        // Literal <
        current.appendChild(document.createTextNode("<"));
        i++;
    }

    if (parent) {
        while (root.firstChild) {
            parent.appendChild(root.firstChild);
        }
        return parent;
    }

    return root;
};


Window.prototype.createApp=()=>{
 

addCSS("http://127.0.0.1:8765/css/style.css")
    .then((style) =>{
       let mathtml = `
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
 window.createHTML(mathtml, App);

       document.body.appendChild(App);

               })
    .catch(error => window.log('createApp error:',error.message));   


}

function debugOv(){try{
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
  "z-index": "100000 !important"
});

    // Optional: change text later
    window.updateOverlayText = function (text) {
        box.textContent = text;
    };

    // Optional: remove overlay
    window.removeOverlay = function () {
        overlay.remove();
    };
      window.addEventListener("error", function (event) {
    //window.log(        "[ERROR] " + event.message +        "\n" + event.filename +        ":" + event.lineno + ":" + event.colno    );
});

// Unhandled Promise rejections
window.addEventListener("unhandledrejection", function (event) {
    //window.log("[PROMISE] " + event.reason);
});
       
var originalConsoleError = console.error;

console.error = function () {
    var message = Array.prototype.map.call(arguments, function (arg) {
        return arg instanceof Error
            ? arg.stack || arg.message
            : String(arg);
    }).join(" ");

    box.textContent += "[CONSOLE ERROR] " + message + "\n";

    originalConsoleError.apply(console, arguments);
};
     //startAssetUpdate();
    }else{
        setTimeout(()=>{debugOv();},0);
    }
 }catch(e){
         setTimeout(()=>{debugOv();},0);
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

const KEY_EVENTS = new Set(['keydown', 'keyup']);
const orig = EventTarget.prototype.addEventListener;

EventTarget.prototype.addEventListener = function (type, listener, options) {
  if (window.disableKey&&KEY_EVENTS.has(type)&&!listener.toString().includes('handleKeyDownEvent')) {
    return;                     
  }
  return orig.call(this, type, listener, options);
};

if(window.dbg){
debugOv();
}
