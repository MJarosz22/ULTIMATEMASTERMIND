function StatusBar() {
  this.setStatus = function(status) {
    const el = document.getElementById("status");
    //flash the statusbar
    //in the future we could add different animations for different statuses
    el.innerHTML = status;
    el.style.animationName="flash";
    el.style.animationDuration="0.8s";
    el.style.animationIterationCount="1";
    el.style.animationTimingFunction="linear";
    el.style.animationFillMode="forwards";
    setTimeout(function(){
      el.style.animationName="";
      el.style.animationDuration="";
      el.style.animationIterationCount="";
      el.style.animationTimingFunction="";
      el.style.animationFillMode="";
    },
      800);
  }
}
