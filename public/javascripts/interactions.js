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
    this.rows.initialize();
    this.hintRows = new HintRows();
    this.hintRows.initialize();
    this.statusBar = sb;
    this.socket = socket;
    this.winner = null;
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
};

/**
 * Sets the code to guess
 * 
 */
GameState.prototype.setTargetCode = function (code) {
    this.targetCode = code;
    this.visibleCodeBoard.setCode(code);
};

/**
 * Checks if anyone won 
 */
GameState.prototype.whoWon = function () {
    //code solved
    if(codeEquals(this.targetCode,this.rows.getRow(this.madeGuesses).getCode())){
        this.winner="B";
        return "B";
    }
    this.madeGuesses++;

    //too many guesses
    if(this.madeGuesses >= Setup.MAX_ALLOWED_GUESSES){
        this.winner="A";
        return "A";
    }
    
    return null; //nobody won
};


/**
 * disable the color and put the clicked color in the current row (Player B)
 * or set the next color in the visivle code borad (Player A)
 * @param {string} clickedColor 
 */
GameState.prototype.colorClicked = function (clickedColor){
    let currentRow = this.rows.getRow(this.madeGuesses);
    if(this.playerType=="B"){//the player is guessing
        currentRow.setNextColor(clickedColor);
        let outgoingMsg = Messages.O_MAKE_A_GUESS;
        outgoingMsg.data=clickedColor;
        this.socket.send(JSON.stringify(outgoingMsg));
        if(currentRow.isFull()){        
            this.updateGame(currentRow.getCode());
    }
    }
    else if (this.playerType=="A"&&this.targetCode==null){//the player is setting the code
        this.visibleCodeBoard.setNextColor(clickedColor);
        if(this.visibleCodeBoard.isFull())
            this.updateGame(this.visibleCodeBoard.getCode());
    }
   else if(this.playerType=="A"){//player B made a guess
        currentRow.setNextColor(clickedColor);
        if(currentRow.isFull()){        
            this.updateGame(currentRow.getCode());
    }
    }

};

/**
 * 
 * @param {*} providedCode read from the current row
 */
GameState.prototype.updateGame = function (providedCode){

    if(this.playerType=="B"&&this.targetCode!=null){//player B guessed
    //send the message to player A
    /*
    let outgoingMsg = Messages.O_MAKE_A_GUESS;
    outgoingMsg.data=providedCode;
    this.socket.send(JSON.stringify(outgoingMsg));*/
    this.hintRows.getHintRow(this.madeGuesses).set(this.targetCode,providedCode);
    const winner = this.whoWon();
    this.statusBar.setStatus(Status["player2Guessed"]);

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

}
    else if(this.playerType=="A"&&this.targetCode==null){ //player A set the code
        this.targetCode=providedCode;
        this.statusBar.setStatus(Status["chosen"]);
        let outgoingMsg = Messages.O_TARGET_CODE;
        outgoingMsg.data=this.targetCode;
        this.socket.send(JSON.stringify(outgoingMsg));       
    }
    else if(this.playerType=="A"&&this.targetCode!=null){
        this.hintRows.getHintRow(this.madeGuesses).set(this.targetCode,providedCode);
        const winner = this.whoWon();

        if (winner != null){
        
            //tell the players who won
            let alertString;
            if(winner == this.playerType){
                alertString = Status["gameWon"];
            } else{
                alertString = Status["gameLost"]
            }
            alertString += Status["playAgain"];
            this.statusBar.setStatus(alertString);
    }
    
    }
};


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
        if(this.color3!="Black"){
            return true;
        }else{
            return false;
        }
    };

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

        this.bigBalls[this.currentColorIndex].firstChild.style.backgroundColor=color;
        this.currentColorIndex++;
    };

    this.getCode = function(){
        return new Code(this.color0,this.color1,this.color2,this.color3);
    };

}


/**
 * A catalogue of all rows
 */
function Rows(){
    this.rows = [];

    /**
     * Initialize the rows
     */
    this.initialize = function(){
        for(let i = 0; i <Setup.MAX_ALLOWED_GUESSES;i++){
            let row = new Row(i);
            this.rows.push(row);
        }
    };


    /**
     * 
     * @param {int} rowId 
     * @returns the row with given ID
     */
    this.getRow = function(rowId){
        return this.rows.find(Row=>Row.id==rowId);
    };

}

/**
 * A row that shows how good is the provided code
 * The hint areas are black by default
 * @param {int} id of the row
 */
function HintRow(id){
    this.id=id;
    this.color0="black";
    this.color1="black";
    this.color2="black";
    this.color3="black";
    this.currentColorIndex=0;
    this.smallBalls=document.getElementsByClassName("HintRow"+id);

    /**
     * Sets the right amount of perfect(red) balls
     * @param {code} targetCode 
     * @param {code} providedCode 
     */
    this.set = function(targetCode,providedCode){
        let countGood=0;
        if(targetCode.color0==providedCode.color0||targetCode.color0==providedCode.color1||targetCode.color0==providedCode.color2||targetCode.color0==providedCode.color3)
            countGood++;
        if(targetCode.color1==providedCode.color0||targetCode.color1==providedCode.color1||targetCode.color1==providedCode.color2||targetCode.color1==providedCode.color3)
            countGood++;
        if(targetCode.color2==providedCode.color0||targetCode.color2==providedCode.color1||targetCode.color2==providedCode.color2||targetCode.color2==providedCode.color3)
            countGood++;
        if(targetCode.color3==providedCode.color0||targetCode.color3==providedCode.color1||targetCode.color3==providedCode.color2||targetCode.color3==providedCode.color3)
            countGood++;
        
        let countPerfect=0;
        if(targetCode.color0==providedCode.color0)
            countPerfect++;
        if(targetCode.color1==providedCode.color1)
            countPerfect++;
        if(targetCode.color2==providedCode.color2)
            countPerfect++;
        if(targetCode.color3==providedCode.color3)
            countPerfect++;

        for(let i=0;i<countPerfect;i++){
            this.setNextColor("Red");
        }
        
        for(let i=0;i<countGood-countPerfect;i++){
            this.setNextColor("White");
        }
    };

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
        this.smallBalls[this.currentColorIndex].firstChild.style.backgroundColor=color;
        this.currentColorIndex++;
    };

}

/**
 * A catalogue of hint rows
 */
function HintRows(){
    this.hintRows = [];

    /**
     * Initialize the array of rows
     */
    this.initialize = function(){
        for(let i = 0; i <Setup.MAX_ALLOWED_GUESSES;i++){
            let hintRow = new HintRow(i);
            this.hintRows.push(hintRow);
        
        }
    };

    /**
     * 
     * @param {int} hintRowId 
     * @returns Row with the given ID
     */
    this.getHintRow = function(hintRowId){
        return this.hintRows.find(HintRow=>HintRow.id==hintRowId);
    };

}




/**
 * Code object
 * @param {string} color0
 * @param {string} color1 
 * @param {stirng} color2 
 * @param {string} color3
 */
function Code (color0,color1,color2,color3){
    this.color0=color0;
    this.color1=color1;
    this.color2=color2;
    this.color3=color3;
}




/**
 * Checks whether two codes are equal
 */
function codeEquals(that,other){
if(that.color0==other.color0&&
    that.color1==other.color1&&
    that.color2==other.color2&&
    that.color3==other.color3)
    return true;
return false;
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
            this.color1=color;
        if(this.currentColorIndex==2)
            this.color2=color;
        if(this.currentColorIndex==3)
            this.color3=color;
            
        this.codeBalls[this.currentColorIndex].style.backgroundColor=color;
        this.currentColorIndex++;

    };

    this.isFull = function(){
        return this.color3 !="Black";
    }


    /**
     * Hides the code
     */
    this.hide = function(){
        Array.from(this.codeBalls).forEach(function(el){
            el.style.backgroundColor = "Black";
        });
        
    };
    /**
    * Reveals the code
    */
    this.reveal = function(){
        let index = 0;
        const color0=this.color0;
        const color1=this.color1;
        const color2=this.color2;
        const color3=this.color3;
        Array.from(this.codeBalls).forEach(function(el){
            let color;
            if(index==0)
                color=color0;
            if(index==1)
                color=color1;
            if(index==2)
                color=color2;
            if(index==3)
                color=color3;
            el.style.backgroundColor = color ;
            index++;
        });
        
    };

    this.setCode = function(code){
        this.color0=code.color0;
        this.color1=code.color1;
        this.color2=code.color2;
        this.color3=code.color3;
        this.codeBalls[0].style.backgroundColor=this.color0;
        this.codeBalls[1].style.backgroundColor=this.color1;
        this.codeBalls[2].style.backgroundColor=this.color2;
        this.codeBalls[3].style.backgroundColor=this.color3;
    }

    this.getCode = function(){
        return new Code(this.color0, this.color1, this.color2, this.color3);
    };
}

/**
 * Colors Board object
 */
function ColorsBoard(gs){

    
    function disable() {
        const elements = document.getElementsByClassName("colorBall");
        Array.from(elements).forEach(function(el){
            el.style.backgroundColor = el.id;
            //remove the eventlisteners
            let new_element = el.cloneNode(true);
            el.parentNode.replaceChild(new_element, el);
            });
        };

        

    
    this.initialize = function() {
        const elements = document.getElementsByClassName("colorBall");
        let count = 0;

        Array.from(elements).forEach(function(el){
            el.style.backgroundColor = el.id;
            el.addEventListener("click", function singleClick(e){
                const clickedColor = e.target["id"];
                gs.colorClicked(clickedColor);

                el.removeEventListener("click",singleClick,false);
                el.style.backgroundColor = "White";
                count++;
                if(count>=4){
                    if(gs.getPlayerType()=="A"){
                        disable();
                        count=0;
                    }
                    if(gs.getPlayerType()=="B"){
                        disable();
                        initialize();
                        count=0;
                    }
                }
            });
        });
    };

    function initialize() {
        const elements = document.getElementsByClassName("colorBall");
        let count = 0;
        Array.from(elements).forEach(function(el){
            el.style.backgroundColor = el.id;
            el.addEventListener("click", function singleClick(e){
                const clickedColor = e.target["id"];
                gs.colorClicked(clickedColor);

                el.removeEventListener("click",singleClick,false);
                el.style.backgroundColor = "White";
                count++;
                if(count>=4){
                    if(gs.getPlayerType()=="A"){
                        disable();
                        count=0;
                    }
                    if(gs.getPlayerType()=="B"){
                        disable();
                        initialize();
                        count=0;
                    }
                }
            });
        });
    };

    
    
}
    

    












//set everything up, incl websocket
(function setup() {
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
    const cb = new ColorsBoard(gs);

    socket.onmessage = function (event) {
            let incomingMsg = JSON.parse(event.data);

        //set player type
        if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
            gs.setPlayerType(incomingMsg.data); // should be "A" or "B"

            if(gs.getPlayerType() == "A"){
                sb.setStatus(Status["player1Intro"]);
                cb.initialize();

            } else{
                sb.setStatus(Status["player2IntroNoTargetYet"]);
            }
        };

        if (incomingMsg.type == Messages.T_NO_PLAYER_B&&
            gs.getPlayerType()=="A"){
            sb.setStatus(Status["player1Waiting"]);
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
        }

        //Player A: wait for guesses and update the board
        if(incomingMsg.type == Messages.T_MAKE_A_GUESS &&
            gs.getPlayerType() == "A"){
                sb.setStatus(Status["guessed"]);
                gs.colorClicked(incomingMsg.data);
            }
    };

    socket.onopen = function () {
        socket.send("{}");
    };

    //server sends a close event only if the game was aborted from some side
    socket.onclose = function () {
        if(gs.winner==null){
            sb.setStatus(Status["aborted"]);
        }
    };

    socket.onerror = function () {};

})(); //execute immediately



