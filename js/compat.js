(function () {
  'use strict';
const inter = setInterval(()=>{
  if(this.location!==undefined&&this.location.href.includes('youtube')){
  this.location.href="https://192.168.100.2:5500";clearInterval(inter);}
}):
})();
