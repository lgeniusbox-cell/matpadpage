(function () {
    document.body.style.background = "red";

    const test = document.createElement("div");
    test.textContent = "COBALT JAVASCRIPT WORKS!";

    Object.assign(test.style, {
        position: "fixed",
        top: "40%",
        left: "10%",
        width: "80%",
        padding: "30px",
        background: "yellow",
        color: "black",
        fontSize: "40px",
        fontWeight: "bold",
        textAlign: "center",
        zIndex: "999999",
        border: "5px solid black"
    });

    document.body.appendChild(test);
})();
