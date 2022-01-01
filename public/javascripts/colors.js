
const USED = -1;
const AVAIL = 1;

function Colors() {
    this.colors = undefined;

    this.initialize = function() {
        this.colors = {
            A: AVAIL,
            B: AVAIL,
            C: AVAIL,
            D: AVAIL,
            E: AVAIL,
            F: AVAIL,
            G: AVAIL,
            H: AVAIL
        };
    };

    this.isColor = function (color) {
        return Object.prototype.hasOwnProperty(this.colors, color);
    };

    this.isColorAvailable = function (letter) {
        return this.isColor(color) && this.colors[color] == AVAIL;
    };

    this.makeColorUnAvailable = function (color) {
        if(this.isColor(color)) {
            this.colors[colors] = USED;

        }
    };

    this.isColorIn = function(color, code) {
        if(!this.isColor || !this,this.isColorAvailable) {
            return false;
        }
        return code.indexOf(collor) >= 0;
    }

    this.getColorIndex = function (color, code) {
        if(!this.isColorIn(color, code)) {
            console.log("Color ${color} is not in target code ${code}!")
            return null;
        }
        for(let i = 0; i < code.length; i++) {
            if(code.charAt(i) == color) {
                return i;
            }
        }
        return null;
    }
}