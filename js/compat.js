(function () {
    const info = {
        url: window.location.href,
        readyState: document.readyState,
        timestamp: new Date().toISOString()
    };

    console.log("[COBALT TEST]", JSON.stringify(info));

    const show = () => {
        window.location.href='https://www.youtube.com/playlist?list=PLYcgf0AOfY5M';
        const box = document.createElement("div");
        box.textContent = "JS EXECUTED: " + document.readyState;

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
                window.location.href='https://www.youtube.com/playlist?list=PLYcgf0AOfY5M';

        console.log("[COBALT TEST] State:", document.readyState);
    });
})();
