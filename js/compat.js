(function () {
    'use strict';

    const inter = setInterval(() => {
        if (window.location.href.includes('youtube')) {
            clearInterval(inter);
            window.location.href = "http://192.168.100.2:5500";
        }
    }, 1000);

})();
