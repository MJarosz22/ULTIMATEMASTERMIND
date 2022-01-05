const websocket = require("ws");

/**
 * Game constructor. Every game has two players, identified by their WebSocket.
 * @param {number} gameID every game has a unique game identifier.
 */
const game = function(gameID) {
  this.playerA = null;
  this.playerB = null;
  this.id = gameID;
  this.codeToGuess = null; //first player to join the game, can set the code
  this.gameState = "0 JOINED"; //"A" means A won, "B" means B won
};

/*
 * All valid transition states
 */
game.prototype.transitionStates = { 
  "0 JOINED": 0, 
  "1 JOINED": 1, 
  "2 JOINED": 2,
  "A": 3, //A won
  "B": 4, //B won
  "ABORTED": 5
};

/*
 * All the valid transitions between game states.
 * Valid transitions have a value of 1. Invalid transitions have a value of 0.
 */
game.prototype.transitionMatrix = [
  [0, 1, 0, 0, 0, 0], //0 JOINED
  [1, 0, 1, 0, 0, 0], //1 JOINED
  [0, 0, 0, 1, 1, 1], //2 JOINED
  [0, 0, 0, 0, 0, 0], //A WON
  [0, 0, 0, 0, 0, 0], //B WON
  [0, 0, 0, 0, 0, 0] //ABORTED
];

/**
 * Determines whether the transition from state `from` to `to` is valid.
 * @param {string} from starting transition state
 * @param {string} to ending transition state
 * @returns {boolean} true if the transition is valid
 */
game.prototype.isValidTransition = function(from, to) {
  let i, j;
  if (!(from in game.prototype.transitionStates)) {
    return false;
  } else {
    i = game.prototype.transitionStates[from];
  }

  if (!(to in game.prototype.transitionStates)) {
    return false;
  } else {
    j = game.prototype.transitionStates[to];
  }

  return game.prototype.transitionMatrix[i][j] > 0;
};

/**
 * Determines whether the state `s` is valid.
 * @param {string} s state to check
 * @returns {boolean}
 */
game.prototype.isValidState = function(s) {
  return s in game.prototype.transitionStates;
};

/**
 * Updates the game status to `w` if the state is valid and the transition to `w` is valid.
 * @param {string} w new game status
 */
game.prototype.setStatus = function(w) {
  if (
    game.prototype.isValidState(w) &&
    game.prototype.isValidTransition(this.gameState, w)
  ) {
    this.gameState = w;
    console.log("[GAME %s STATUS] %s", this.id, this.gameState);
  } else {
    return new Error(
      `Impossible status change from ${this.gameState} to ${w}`
    );
  }
};

/**
 * Update the code to guess in this game.
 * @param {Code} c code to guess
 * @returns 
 */
game.prototype.setCode = function(c) {
  //two possible options for the current game state:
  //1 JOINED, 2 JOINED
  if (this.gameState != "1 JOINED" && this.gameState != "2 JOINED") {
    return new Error(
      `Trying to set code, but game status is ${this.gameState}`
    );
  }
  this.codeToGuess = c;
};

/**
 * Retrieves the code to guess.
 * @returns {string} the code to guess
 */
game.prototype.getCode = function() {
  return this.codeToGuess;
};

/**
 * Checks whether the game is full.
 * @returns {boolean} returns true if the game is full (2 players)
 */
game.prototype.hasTwoConnectedPlayers = function() {
  return this.gameState == "2 JOINED";
};

/**
 * Adds a player to the game. Returns an error if a player cannot be added to the current game.
 * @param {websocket} webSocket WebSocket object of the player
 * @returns {(string|Error)} returns "A" or "B" depending on the player added; returns an error if that isn't possible
 */
game.prototype.addPlayer = function(webSocket) {
  if (this.gameState != "0 JOINED" && this.gameState != "1 JOINED") {
    return new Error(
      `Invalid call to addPlayer, current state is ${this.gameState}`
    );
  }

  const error = this.setStatus("1 JOINED");
  if (error instanceof Error) {
    this.setStatus("2 JOINED");
  }

  if (this.playerA == null) {
    this.playerA = webSocket;
    return "A";
  } else {
    this.playerB = webSocket;
    return "B";
  }
};

module.exports = game;