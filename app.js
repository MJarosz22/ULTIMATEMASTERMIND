const express = require("express");
const http = require("http");
const websocket = require("ws");

const indexRouter = require("./routes/index");
const messages = require("./public/javascripts/messages");

const gameStatus = require("./statTrack");
const Game = require("./game");

if(process.argv.length < 3){
    console.log("Error: expected a port as argument.");
    process.exit(1);
}

const port = process.argv[2];
const app = express();

app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

app.get("/play", indexRouter);
app.get("/", indexRouter);

const server = http.createServer(app);
const wss = new websocket.Server({server});

const websockets = {};

/**
 * regularly clean up websockets
 */
setInterval(function(){
    for (let i in websockets){
        if(Object.prototype.hasOwnProperty.call(websockets,i)){
            let gameObj = websockets[i];
        //if the gameObj has a final status, the game is complete/aborted
        if(gameObj.finalStatus != null){
            delete websockets[i];
        }
        }
    }
},50000);

let currentGame = new Game(gameStatus.gamesInitialized++);
let connectionID = 0; //each websocket receives a unique id

wss.on("connection", function connection(ws){
    const con = ws;
    con["id"] = connectionID++;
    const playerType = currentGame.addPlayer(con);
    websockets[con["id"]] = currentGame;

    console.log(
        `Player ${con["id"]} placed in game ${currentGame.id} as ${playerType}`
    );

    con.send(playerType == "A" ? messages.S_PLAYER_A : messages.S_PLAYER_B);

    /**
     * player b receives the target code if available
     */
    if(playerType == "B" && currentGame.getCode() != null){
        let msg = messages.O_TARGET_CODE;        
        msg.data = currentGame.getCode();  
        con.send(JSON.stringify(msg));
    }

    if(currentGame.hasTwoConnectedPlayers()){
        currentGame = new Game(gameStatus.gamesInitialized++);
    }

    con.on("message", function incoming(message){
        const oMsg = JSON.parse(message.toString());

        const gameObj = websockets[con["id"]];
        const isPlayerA = gameObj.playerA == con ? true : false;

        if(isPlayerA){
            //player A sent target code
            if(oMsg.type == messages.T_TARGET_CODE){
                gameObj.setCode(oMsg.data);
                let msg = messages.O_TARGET_CODE;        
                msg.data = oMsg.data;
                if(gameObj.hasTwoConnectedPlayers()){
                    gameObj.playerB.send(JSON.stringify(msg));
                }
            }
        } else {
            //Player B made a guess
            if(oMsg.type == messages.T_MAKE_A_GUESS){
                gameObj.playerA.send(message);
                gameObj.setStatus("COLOR GUESSED");
            }

            if(oMsg.type == messages.T_GAME_WON_BY){
                gameObj.setStatus(oMsg.data);
                //update stats
                gameStatus.gamesCompleted++;
            }
        }
    });

    con.on("close", function(code){
        console.log(`${con["id"]} disconnected ...`);

        if(code == 1001){
            const gameObj = websockets[con["id"]];

            if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")){
                gameObj.setStatus("ABORTED");
                gameStatus.gamesAborted++;

                try{
                    gameObj.playerA.close();
                    gameObj.playerA = null;
                } catch (e){
                    console.log("Player A closing: " + e);
                }

                try{
                    gameObj.playerB.close();
                    gameObj.playerB = null;
                } catch (e){
                    console.log("Player B closing: " +e);
                }
            }
        }
    });
});

server.listen(port);
