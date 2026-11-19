/*https://www.youtube.com/tv#/watch?v=l9VAOzSL6ec&list=RDl9VAOzSL6ec
    window.location.href='https://www.youtube.com/tv#/tv_config?action_get_config=true&client=lb4&theme=cl&recovered_tvfas=490533%3A2';
       window.location.href='https://www.youtube.com/tv/playlist#/browse?c=UCOdTOUg4e9UH01s9KRe9FaQ';
        const box = document.createElement("div");
        box.textContent = "JS EXECUTED: " + 'https://www.youtube.com/playlist?list=PLYcgf0AOfY5M';*/
(function () {
  //let arr = [];
const mt = Map.prototype.set;
Map.prototype.set = function (...args) {
  if (args[1]?.DA !== undefined) {
    console.log('hello');
      //arr.push(args);
  }
  return mt.apply(this, []);
};
})();
