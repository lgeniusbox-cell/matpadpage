/*https://www.youtube.com/tv#/watch?v=l9VAOzSL6ec&list=RDl9VAOzSL6ec
    window.location.href='https://www.youtube.com/tv#/tv_config?action_get_config=true&client=lb4&theme=cl&recovered_tvfas=490533%3A2';
       window.location.href='https://www.youtube.com/tv/playlist#/browse?c=UCOdTOUg4e9UH01s9KRe9FaQ';
        const box = document.createElement("div");
        box.textContent = "JS EXECUTED: " + 'https://www.youtube.com/playlist?list=PLYcgf0AOfY5M';*/
(function () {
  const responseDescriptor =
    Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response');



Object.defineProperty(XMLHttpRequest.prototype, 'response', {
    get: function () {
        const result = responseDescriptor.get.call(this);
        let mt = result;
        if (this.responseURL?.includes('v_config?action_get_config=true')) {
            mt = result.replace(
    /(webEnablePremiumAdsSeenLogging.*?\b)false\b/,
    "$1true"
);
        }

        return mt;
    }
});

})();
