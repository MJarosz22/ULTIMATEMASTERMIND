/**
 * Game state object
 */

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
    this.playerBMadeAGuess=false;
}

/**
 * Row object
 */
function Row(id){
    this.id = id;
    this.currentColorIndex = 0;
    this.color0 = "Black";
    this.color1 = "Black";
    this.color2 = "Black";
    this.color3 = "Black";
    this.bigBalls = document.getElementsByClassName("Row"+id);


    /**
     * Checks whether the row is full
     */
    this.isFull = function(){
        return this.color3!="Black";
    }

    /**
     * Sets the next color in the row
     * @param {string} color 
     */
    this.setNextColor = function(color){
        if(this.currentColorIndex==0)
            this.color0=color;
        if(this.currentColorIndex==1)
            this.color1=color;
        if(this.currentColorIndex==2)
            this.color2=color;
        if(this.currentColorIndex==3)
            this.color3=color;

        bigBalls[currentColorIndex].style.backgroundColor=color;
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
    this.currentColorIndex=0;
    this.smallBalls=document.getElementsByClassName("HintRow"+id);

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
            this.setNextColor("Red");
        }
    }

    /**
     * Sets the next color in the row
     * @param {string} color 
     */
    this.setNextColor = function(color){
        if(this.currentColorIndex==0)
            this.color0=color;
        if(this.currentColorIndex==1)
            this.color1=color;
        if(this.currentColorIndex==2)
            this.color2=color;
        if(this.currentColorIndex==3)
            this.color3=color;
        smallBalls[currentColorIndex].style.backgroundColor=color;
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
    
        for(let i = 0; i <Setup.MAX_ALLOWED_GUESSES;i++){
            let hintRow = new HintRow(i);
            this.hintRows.push(hintRow);
        
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
    this.color0="Black";
    this.color1="Black";
    this.color2="Black";
    this.color3="Black";
    this.currentColorIndex=0;
    this.codeBalls = document.getElementsByClassName("codeBall");

    /**
     * Sets the next color
     * @param {string} color 
     */
    this.setNextColor = function(color){
        
        if(this.currentColorIndex==0)
            this.color0=color;
        if(this.currentColorIndex==1)
            this.color2=color;
        if(this.currentColorIndex==2)
            this.color3=color;
        if(this.currentColorIndex==3)
            this.color4=color;
            
        codeBalls[currentColorIndex].style.backgroundColor=color;
        currentColorIndex++;

    }


    /**
     * Hides the code
     */
    this.hide = function(){
        Array.from(this.codeBalls).forEach(function(el){
            el.style.backgroundColor = "Black";
        });
        
    }
    /**
    * Reveals the code
    */
    this.reveal = function(){
        let index = 0;
        Array.from(this.codeBalls).forEach(function(el){
            let color;
            if(index==0)
                color=this.color0;
            if(index==1)
                color=this.color1;
            if(index==2)
                color=this.color2;
            if(index==3)
                color=this.color3;
            el.style.backgroundColor = color ;
            index++;
        });
        
    }

    this.getCode = function(){
        return new Code(this.color1, this.color2, this.color3, this.color4);
    }
}

/**
 * Colors Board object
 */
function ColorsBoard(gs){
    

    this.initialize = function () {
        const elements = document.getElementsByClassName("colorBall");
        Array.from(elements).forEach(function(el){
            el.style.backgroundColor = el.id;
            el.addEventListener("click", function singleClick(e){
                const clickedColor = e.target["id"];
                gs.colorClicked(clickedColor);

                el.removeEventListener("click",singleClick,false);
                el.style.backgroundColor = "White";
            });
        });
    };

    this.disable = function() {
        const elements = document.getElementsByClassName("colorBall");
        Array.from(elements).forEach(function(el){
            el.style.backgroundColor = el.id;
            //remove the eventlisteners
            let new_element = el.cloneNode(true);
            el.parentNode.replaceChild(new_element, el);
            });
        };
    
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
    
    if(this.playerType=="B"){//the player is guessing
        const currentRow = this.Rows.getRow(this.madeGuesses);
        currentRow.setNextColor(clickedColor);
        if(currentRow.isFull()){        
            this.updateGame(currentRow.getCode());
    };
    }
    else if (this.playerType=="A"&&this.targetCode==null){//the player is setting the code
        this.visibleCodeBoard.setNextColor(clickedColor);
        if(currentRow.isFull())
            this.updateGame(this.visibleCodeBoard.getCode());
    }
    else if(this.playerType=="A"){//player B made a guess
        const currentRow = this.Rows.getRow(this.madeGuesses);
        currentRow.setNextColor(clickedColor);
        if(currentRow.isFull()){        
            this.updateGame(currentRow.getCode());
    };
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
    this.playerBMadeAGuess = true;
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
    this.colorsBoard.initialize();
}
    else if(this.targetCode==null){ //player A set the code
        this.targetCode=providedCode;
        this.visibleCodeBoard.hide();
    }
    else{ //player B made a guess, update the board for player A
        this.hintRows.getHintRow(this.madeGuesses).set(targetCode,providedCode);
        this.madeGuesses++;
    }
}

/**
 * reveal the targetCode
 */
GameState.prototype.revealCode = function (){
    this.VisibleCodeBoard.reveal();
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
                while(gs.targetCode()==null){
                    //the player sets the code
                }
                cb.disable(); //disable the colorsboard for player A

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
            gs.visibleCodeBoard.hide();

            sb.setStatus(Status["player2Intro"]);
            cb.initialize();
            while(gs.whoWon()==null){//wait for the player the game to end
                if(gs.playerBMadeAGuess){
                    cb.initialize();            //initialize the colorsboard for player B everytime they made a guess
                    gs.playerBMadeAGuess = false;
                }
            }
            cb.disable(); //the game is over, disable the colorsboard for  player B
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




