function VisibleCodeBoard() {
    this.setCode = function(visibleCode) {
      document.getElementById("code").innerHTML = (Array.isArray(visibleCode) ? visibleCode.join("") : visibleCode);
    };
  }

function StatusBar() {
  this.setStatus = function(status) {
    document.getElementById("status").innerHTML = status;
  };
}  