Window.prototype.cap = null;
    const original = constructor.constructor.prototype.call;

     constructor.constructor.prototype.call = function (...args) {
       //  let d = args.filter(e=>typeof e=='string');

      const h = args.filter(x=>x?.AdService!==undefined);
         if(h.length>0){
                        window.cap=h[0];
             setTimeout(()=>{
                 ping();
             },1000);
                        constructor.constructor.prototype.call=original;
                       }

        return original.apply(this, args);
    };

function log(...args){
    if(window.boxdebug!==undefined){
    window.boxdebug.textContent=args.join(' | ');
      }
}

function ping(){
let jo = []
Object.values(window.cap).forEach(v=>{
   if(v.type!=='factory'){ jo.push(v.value)}
});

Window.prototype.m=[];
jo.forEach(j=>{
Object.keys(j).forEach(k=>{
try{
    Object.values(j[k]).forEach(p=>{
        if(p?.constructor.name=='Map'){
            window.m.push(p);
        }
    })}catch{}
})
});
    if(window.m.length==0){return setTimeout(()=>{ping()},1000)}
  const n =  window.m.filter(d=>
    d.get("RELOAD_PLAYER")!==undefined
).length
    log(n);
}

function setStyles(el, styles) {
  if(el!==undefined){
  for (var prop in styles) {
    if (styles.hasOwnProperty(prop)) {
      el.style.setProperty(prop, styles[prop], 'important');
    }
  }}
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

preload();
