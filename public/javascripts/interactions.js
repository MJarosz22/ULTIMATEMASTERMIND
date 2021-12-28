/**
 * Game state object
 */

const { colors } = require("debug/src/browser");

function GameState(vc, sb, socket){
    this.playerType = null;
    this.MAX_ALLOWED = Setup.MAX_ALLOWED_GUESSES;
    this.madeGuesses = 0;
    this.targetCode = null;
    this.visibleCodeBoard = vc;
    this.rows = new Rows();
    this.hintRows = new HintRows();
    this.statusBar = sb;
    this.socket = socket;
}

/**
 * Row object
 */
function Row(Id){
    this.Id = Id;
    this.currentColorIndex = 1;
    this.color1 = null;
    this.color2 = null;
    this.color3 = null;
    this.color4 = null;


    /**
     * Checks whether the row is full
     */
    this.isFull = function(){
        return this.color4!=null;
    }

    /**
     * Sets the next color in the row
     * @param {string} color 
     */
    this.setNextColor = function(color){
        if(this.currentColorIndex==1)
            this.color1=color;
        if(this.currentColorIndex==2)
            this.color2=color;
        if(this.currentColorIndex==3)
            this.color3=color;
        if(this.currentColorIndex==4)
            this.color4=color;
        currentColorIndex++;
    }

    this.getCode = function(){
        return new Code(color1,color2,color3,color4);
    }

}


/**
 * A catalogue of all rows
 */
function Rows(){
    this.rows = undefined;

    /**
     * Initialize the rows
     */
    this.initialize = function(){
        for(let i = 0; i <Setup.MAX_ALLOWED_GUESSES;i++){
            let row = new Row(i);
            this.rows.push(row);
        }
    }


    /**
     * 
     * @param {int} rowId 
     * @returns the row with given ID
     */
    this.getRow = function(rowId){
        return this.rows.find(Row=>Row.Id==rowId);
    }

}

/**
 * A row that shows how good is the provided code
 * The hint areas are black by default
 * @param {int} id of the row
 */
function HintRow(id){
    this.id=id;
    this.color1="black";
    this.color2="black";
    this.color3="black";
    this.color4="black";
    this.currentColorIndex=1;

    /**
     * Sets the right amount of perfect(red) balls
     * @param {code} targetCode 
     * @param {code} providedCode 
     */
    this.set = function(targetCode,providedCode){
        let countPerfect=0;
        if(targetCode.getReel1==providedCode.getReel1)
            countPerfect++;
        if(targetCode.getReel2==providedCode.getReel2)
            countPerfect++;
        if(targetCode.getReel3==providedCode.getReel3)
            countPerfect++;
        if(targetCode.getReel4==providedCode.getReel4)
            countPerfect++;

        for(let i=0;i<countPerfect;i++){
            this.setNextColor("red");
        }
    }

    /**
     * Sets the next color in the row
     * @param {string} color 
     */
    this.setNextColor = function(color){
        if(this.currentColorIndex==1)
            this.color1=color;
        if(this.currentColorIndex==2)
            this.color2=color;
        if(this.currentColorIndex==3)
            this.color3=color;
        if(this.currentColorIndex==4)
            this.color4=color;
        currentColorIndex++;
    }

}

/**
 * A catalogue of hint rows
 */
function HintRows(){
    this.hintRows = undefined;

    /**
     * Initialize the array of rows
     */
    this.initialize = function(){
        for(let i = 0; i <Setup.MAX_ALLOWED_GUESSES;i++){
            let hintRow = new HintRow(i);
            this.hintRows.push(hintRow);
        }
    }

    /**
     * 
     * @param {int} hintRowId 
     * @returns Row with the given ID
     */
    this.getHintRow = function(hintRowId){
        return this.hintRows.find(hintRow=>hintRow.Id==hintRowId);
    }

}




/**
 * Code object
 * @param {string} reel1 
 * @param {string} reel2 
 * @param {stirng} reel3 
 * @param {string} reel4 
 */
function Code (reel1,reel2,reel3,reel4){
    this.reel1=reel1;
    this.reel2=reel2;
    this.reel3=reel3;
    this.reel4=reel4;
};




/**
 * Checks whether two codes are equal
 */
Code.prototype.equals= function(other){
if(this.reel1===other.reel1&&
    this.reel2===other.reel2&&
    this.reel3===other.reel3&&
    this.reel4===other.reel4)
    return true;
return false;
};

/**
 * 
 * @returns color of reel1
 */
Code.prototype.getReel1 = function(){
    return this.reel1;
};

/**
 * 
 * @returns color of reel2
 */
Code.prototype.getReel2 = function(){
    return this.reel2;
};

/**
 * 
 * @returns color of reel3
 */
Code.prototype.getReel3 = function(){
    return this.reel3;
};

/**
 * 
 * @returns color of reel4
 */
Code.prototype.getReel1 = function(){
    return this.reel4;
};


/**
 * Target Code object. Stores the code to guess. Visible to player "A", hidden for player "B"
 */
function VisibleCodeBoard(){
    this.color1="white";
    this.color2="white";
    this.color3="white";
    this.color4="white";
    this.currentColorIndex=1;


    /**
     * Sets the next color
     * @param {string} color 
     */
    this.setNextColor = function(color){
        if(this.currentColorIndex==1)
            this.color1=color;
        if(this.currentColorIndex==2)
            this.color2=color;
        if(this.currentColorIndex==3)
            this.color3=color;
        if(this.currentColorIndex==4)
            this.color4=color;
    }


    /**
     * Hides the code
     */
    this.hide = function(){
        //TODO
    }
    /**
    * Reveals the code
    */
    this.reveal = function(){
        //TODO
    }

    this.getCode = function(){
        return new Code(this.color1, this.color2, this.color3, this.color4);
    }
}

/**
 * Colors Board object
 */
function ColorsBoard(gs){
    this.colors = new Colors();
    colors.initialize();

    this.initialize = function () {
        const elements = document.querySelectorAll(".color");
        Array.from(elements).forEach(function(el){
            el.addEventListener("click", function singleClick(e){
                const clickedColor = e.target["id"];
                gs.colorClicked(clickedColor);

                el.removeEventListener("click",singleClick,false);
            });
        });
    };

    this.disableColorButton = function(clickedColor){
        colors.makeColorUnavailable(clickedColor);
    }

    
}





/**
 * Set the player type
 * @param {String} p player type to set
 */
GameState.prototype.setPlayerType = function (p) {
    this.playerType = p;
};

/**
 * Retrieves the player type
 * @returns {string} player type
 */
GameState.prototype.getPlayerType = function(){
    return this.playerType;
}


/**
 * Sets the code to guess
 * @param {string} reel1 
 * @param {string} reel2 
 * @param {string} reel3 
 * @param {string} reel4 
 */
GameState.prototype.setTargetCode = function () {
    this.TargetCode = this.VisibleCodeBoard.getCode();
}




/**
 * Checks if anyone won 
 */
GameState.prototype.whoWon() = function () {
    //code solved
    if(this.targetCode.equals(rows.getRow(this.madeGuesses)))
        return "B";
    this.madeGuesses++;

    //too many guesses
    if(this.madeGuesses >= Setup.MAX_ALLOWED_GUESSES){
        return "A";
    }
    
    return null; //nobody won
}



/**
 * disable the color and put the clicked color in the current row (Player B)
 * or set the next color in the visivle code borad (Player A)
 * @param {string} clickedColor 
 */
GameState.prototype.colorClicked = function (clickedColor){
    disableColorButton(clickedColor);
    
    if(this.playerType=="B"){//the player is guessing
        const currentRow = this.Rows.getRow(this.madeGuesses);
        currentRow.setNextColor(clickedColor);
        if(currentRow.isFull()){        
            this.updateGame(currentRow.getCode());
    };
    }
    else{//the player is setting the code
        this.visibleCodeBoard.setNextColor(clickedColor);
        if(currentRow.isFull())
            this.updateGame(this.visibleCodeBoard.getCode());
    }

};

/**
 * 
 * @param {*} providedCode read from the current row
 */
GameState.prototype.updateGame = function (providedCode){

    if(this.playerType=="B"){//player B guessed
    //set the colors in the hint row
    this.hintRows.getHintRow(this.madeGuesses).set(targetCode,providedCode);

     //is the game complete?
    const winner = this.whoWon();
    this.madeGuesses++;

    //if the game  is over
    if (winner != null){
        this.visibleCodeBoard.reveal();
    
        //tell the players who won
        let alertString;
        if(winner == this.playerType){
            alertString = Status["gameWon"];
        } else{
            alertString = Status["gameLost"]
        }
        alertString += Status["playAgain"];
        this.statusBar.setStatus(alertString);
    

    //player B sends final message
    if (this.playerType == "B") {
        let finalMsg = Messages.O_GAME_WON_BY;
        finalMsg.data = winner;
        this.socket.send(JSON.stringify(finalMsg));
    }
    this.socket.close();
    }
    this.colorsBoard.resetBoard();
}
    else{ //player A set the code
        this.targetCode=providedCode;
        this.visibleCodeBoard.hide();
    }
}

/**
 * reveal the targetCode
 */
GameState.prototype.revealCode = function (){
    this.VisibleCodeBoard.reveal();
}




/**
 * Disable the clicked color
 */
function disableColorButton(color) {
    const colorsBoard = document.getElementById("colorsBoard");
    const colorToDisable = colorsBoard.getElementById(color);
    colorToDisable.style.color = "black";
}


//set everything up, incl websocket
(function setup(){
    const socket = new WebSocket(Setup.WEB_SOCKET_URL);

    /**
     * initialize all UI elements of the game:
     * - rows
     * - hint rows
     * - colors board
     * - status bar
     * - reveal code board
     * 
     * the GameState object coordinates everything
     */

    const vc = new VisibleCodeBoard();
    const sb = new StatusBar();

    const gs = new GameState(vc, sb, socket);
    let cb = new ColorsBoard(gs);

    

    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);

        //set player type
        if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
            gs.setPlayerType(incomingMsg.data); // should be "A" or "B"

            if(gs.getPlayerType() == "A"){
                sb.setStatus(Status["player1Intro"]);
                cb.initialize();

            } else{
                sb.setStatus(Status["player2IntroNoTargetYet"])
            }
        }

        //Player B: wait for target code and start playing
        if(
            incomingMsg.type == Messages.T_TARGET_CODE &&
            gs.getPlayerType() == "B"
        ){
            gs.setTargetCode(incomingMsg.data);

            sb.setStatus(Status["player2Intro"]);
            //todo
        }

        //Player A: wait for guesses and update the board
        if(incomingMsg.type == Messages.T_MAKE_A_GUESS &&
            gs.getPlayerType() == "A"){
                sb.setStatus(Status["guessed"]);
                gs.updateGame(incomingMsg.data);
            }
    };

    socket.onopen = function () {
        socket.send("{}");
    };

    //server sends a close event only if the game was aborted from some side
    socket.onclose = function () {
        if(gs.whoWon()==null){
            sb.setStatus(Status["aborted"]);
        }
    };

    socket. onerror = function () {};

})(); //execute immediately




