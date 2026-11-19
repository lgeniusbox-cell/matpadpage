//https://www.youtube.com/tv#/watch?v=l9VAOzSL6ec&list=RDl9VAOzSL6ec
(function () {
    const info = {
        url: window.location.href,
        readyState: document.readyState,
        timestamp: new Date().toISOString()
    };

    console.log("[COBALT TEST]", JSON.stringify(info));

    const show = () => {
                     window.location.href='https://www.youtube.com/tv#/tv_config?action_get_config=true&client=lb4&theme=cl&recovered_tvfas=490533%3A2';
       // window.location.href='https://www.youtube.com/tv/playlist#/browse?c=UCOdTOUg4e9UH01s9KRe9FaQ';
        const box = document.createElement("div");
        //box.textContent = "JS EXECUTED: " + 'https://www.youtube.com/playlist?list=PLYcgf0AOfY5M';

        Object.assign(box.style, {
            position: "fixed",
            top: "10px",
            left: "10px",
            padding: "20px",
            background: "red",
            color: "white",
            fontSize: "25px",
            zIndex: "999999"
        });

        document.body.appendChild(box);
    };

    if (document.body) {
        show();
    } else {
        document.addEventListener("DOMContentLoaded", show, { once: true });
    }

    document.addEventListener("readystatechange", () => {

        console.log("[COBALT TEST] State:", document.readyState);
    });
})();
