// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2026-11-19
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

  window.captured = {
    api: [],        // RW/WW facade
    q3: [],         // inner player
    loader: [],     // i1/v1 streaming loader
    abr: [],        // uQa
    mediaSource: [],// NL
    mediaElement: [],// e4/y2
      more:[],
  };

  const seen = new WeakSet();

  function classify(obj) {
    if (!obj || typeof obj !== "object" || seen.has(obj)) return;
    try {
      // API facade
      if (typeof obj.getPresentingPlayerType === "function" &&
          typeof obj.getVideoData === "function" &&
          typeof obj.loadVideoByPlayerVars === "function") {
        window.captured.api.push(obj); seen.add(obj); return;
      }

      // q3 inner player
      if (typeof obj.getPlayerType === "function" &&
          obj.videoData && obj.playerState && typeof obj.loader !== "undefined") {
        window.captured.q3.push(obj); seen.add(obj); return;
      }
      // i1 / v1 loader
      if (obj.videoTrack && obj.audioTrack && obj.Jd && obj.qa &&
          typeof obj.seek === "function" && typeof obj.MF === "function") {
        window.captured.loader.push(obj); seen.add(obj); return;
      }
      // uQa ABR
      if (obj.D && Array.isArray(obj.D) && typeof obj.Ly === "function" &&
          typeof obj.Mw === "function") {
        window.captured.abr.push(obj); seen.add(obj); return;
      }
      // NL MediaSource
      if (typeof obj.Au === "function" && typeof obj.clear === "function" &&
          typeof obj.qf === "function") {
        window.captured.mediaSource.push(obj); seen.add(obj); return;
      }
    } catch (e) {}
  }

  const origApply = Function.prototype.apply;
  Function.prototype.apply = function (self, args) {
    try { if (self && typeof self === "object") classify(self); } catch (e) {}
    return origApply.call(this, self, args);
  };

    window.matpad ={browseId:"UCOdTOUg4e9UH01s9KRe9FaQ",ready:false,bd : {
    "context": {
        "client": {
            "screenWidthPoints": 1920,
            "screenHeightPoints": 1080,
            "utcOffsetMinutes": 60,
            "hl": "en-GB",
            "gl": "DZ",
            "remoteHost": "105.102.175.79",
            "deviceMake": "Generic",
            "deviceModel": "Android",
            "visitorData": "CgtFR1NrRVFlNUI3VSjD-vrXBjIKCgJEWhIEGgAgH2LCAgq_AkN1d0JDQVVTbmdFQkRCNlBERlVpb0JvMzcyN3BwSDZhSzdJT3QzRkdtT1ZfVVJVUHJ6Y2JPWmxnNFJ1S0gzMkQ1OUhsNnBET1JqQ1N3b01SdndtQk43ZklYZFJ0bmkxX0c2Y29yWU8xdHNRMWZkeGJnTFNmWjZySktkZDZaWElOdTNyT0VkLWt2NVBzOHhKR0VsbnFwbVlRdmlIeXZZNWh2TnpKNW1JSHQwVTN5NGEzcHowS29YSnNWMXY1MGN0TjF3TEZ6dF9HWFFDQkdDTE0tZGdaZmFQekJsTWZoU2dGTWtVQkhGajFhcTh3NkV3aHFPXzZGMVdhTWFGb2toMVdGVGtkczdCS01RNzl2RVlCenhNY1h5UC1YX3I5Z3FyNWNiRm5ObnlxcndXOEQxbjBZSS12LVRGb01XYXZVQW8%3D",
            "userAgent": "Mozilla/5.0 (Linux; Android 12) Cobalt/27.2.3-gold (PS4),gzip(gfe)",
            "clientName": "TVHTML5",
            "clientVersion": "7.20261117.12.00",
            "osName": "PlayStation 4",
            "osVersion": "",
            "originalUrl": "https://www.youtube.com/tv",
            "theme": "CLASSIC",
            "platform": "MOBILE",
            "clientFormFactor": "UNKNOWN_FORM_FACTOR",
            "webpSupport": false,
            "configInfo": {
                "appInstallData": "CMP6-tcGEMn2gBMQyvuAExCW_dIcEMGP0BwQ3orTHBC9tq4FEJzl0hwQ8cbSHBDcrdIcEI3k0RwQrJbTHBDqjNMcELjkzhwQ2vfOHBCHrM4cEKak0xwQ04rTHBCfz4ATEMzfrgUQnaHTHBDxntMcEN68zhwQr_DSHBDw3tEcEIHNzhwQmY2xBRD2q7AFEM-p0xwQ2MPTHBDB_9IcEPza0hwQvLfTHBC__tIcEK7e0RwQ8pXTHBD1ldMcEKe_0xwQpKnRHBDL-9IcEK7WzxwQ6fLSHBDxtNAcENOk0hwQvoqwBRCe0LAFEJav0hwQma_SHBC8pNAcEPfA0xwQ67DTHBCW2dIcEN2p0xwQ5rrTHBCfxtMcEL-60xwQ_J3THBDWn9McEJKp0xwQuJXTHBCv-NEcELbr0hwQibDOHBC23tEcELOR0RwQvvjSHBC8_NIcEKWt0xwQyPjSHBDNkNMcELKKuCIQ7M3QHBDgo4ETEPuq0xwqdENBTVNVeFZJLVpxLURNZVVFcFVDblJ1ZUJmT3BCcXpCQU53VTBBVHpCTWtGQ0h3Y3dRSGJuZWtMNWF3RWs4d0R0dVFHNUlVWHJMc0Q4UGtGeWN3TUJaT2pCUUxLSDdWaVo0S1RCb0FQcmNjRzdNMEZCQjBIMAA%3D",
                "hotHashData": "CMP6-tcGEhQxNjA0OTI3MDk3Nzg4NDQ1MjIwNxjD-vrXBjoyQUhocUFpMEtBYVFNTHd2VjlNV1ZiblRJLXFDaHlNcm1NME9xT1JfZUp5MXZJamlCSEFiSAgAENq-05vYk5gDGNq-05vYk5gDIjJBSGhxQWkzT05RRTNZc2RreFhRTE9weGhKNU9kZHBZUTNtMTV1UkdLSk0xc211WFUyZw%3D%3D"
            },
            "tvAppInfo": {
                "appQuality": "TV_APP_QUALITY_FULL_ANIMATION",
                "releaseVehicle": "COBALT_RELEASE_VEHICLE_LEGACY_THIRD_PARTY",
                "voiceCapability": {
                    "hasSoftMicSupport": true,
                    "hasHardMicSupport": true,
                    "useHoldToTalkPrompt": false
                },
                "signedInAccountCount": 0,
                "supportsNativeScrolling": false,
                "watchPageInfo": {
                    "watchPageVersion": "WATCH_PAGE_VERSION_V2025",
                    "combineChannelSdEntrypoints": false,
                    "enableDirectToChannelPage": false,
                    "disableSpeedBumps": false
                }
            },
            "userInterfaceTheme": "USER_INTERFACE_THEME_DARK",
            "timeZone": "Africa/Algiers",
            "browserName": "Cobalt",
            "browserVersion": "27.2.3-gold",
            "acceptHeader": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "deviceExperimentId": "ChxOelU0TlRNNU9UYzNNVEV4T1RneE56STRPUT09EMP6-tcGGOeBk8oG",
            "rolloutToken": "CJbq_P2OmKvbaRCEzbmsi8ORAxib9IXmtJKYAw%3D%3D",
            "screenDensityFloat": 1,
            "windowWidthPoints": 1920,
            "windowHeightPoints": 1080,
            "mediaCapabilities": {
                "videoFormatCapabilities": [
                    {
                        "videoCodec": 4
                    }
                ]
            },
            "memoryTotalKbytes": "8000000"
        },
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
}};

   const Hmp=HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function(...args){
        if(window.matpad.api==undefined){
        window.matpad['api'] =  window.captured.api[0].state.B
            window.matpad.api.pauseVideo();
            setTimeout(matpadcfg,0);
            return;
        }
    return Hmp.apply(this,args);

    }
    function matpadcfg(){
        window.matpad['apiInterface'] =  window.matpad.api.getApiInterface();
    }

  function getPlaylist(b){
      window.matpad.bd.browseId =b;
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
  body: JSON.stringify(window.matpad.bd)
});

                        }



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
            if(!window.matpad.ready){
                try {
                    let payload = null;

                    if (typeof body === 'string') {
                        payload = JSON.parse(body);
                    }
                    window.matpad.bd.context.client = payload.context.client;
                    console.log('[player payload]',window.matpad.bd);
                    window.matpad.ready=true;
                } catch (e) {
                    console.log('[player payload] error:', e);
                }}
            }
        } catch (e) {
            console.log('[XHR hook error]', e);
        }

        return NATIVE_SEND.apply(this, arguments);
    };

})();
/*
playlists: [];
nj.contents.tvBrowseRenderer.content.tvSurfaceContentRenderer.content.sectionListRenderer.contents[1].shelfRenderer.content.horizontalListRenderer.items
playlist:[];
nj.contents.tvBrowseRenderer.content.tvSurfaceContentRenderer.content.twoColumnRenderer.rightColumn.playlistVideoListRenderer.contents
*/

//document.querySelector('yt-unified-overlay-stage').remove();


