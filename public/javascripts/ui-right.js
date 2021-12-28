function VisibleCodeBoard() {
    this.setCode = function(visibleCode) {
      document.getElementById("code").innerHTML = (Array.isArray(visibleCode) ? visibleCode.join("") : visibleCode);
    };
  }

function createColors() {

    const colors = ["purple", "orange", "pink", "red", "darkblue", "yellow", "green", "lightblue"];
}

function StatusBar() {
  this.setStatus = function(status) {
    document.getElementById("status").innerHTML = status;
  };