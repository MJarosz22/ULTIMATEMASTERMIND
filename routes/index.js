/**
 * All the routes on the website
 */
const express = require('express');
const router = express.Router();
const gameStatus = require("../statTrack");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('splash.ejs', { gamesInitialized: gameStatus.gamesInitialized, gamesCompleted: gameStatus.gamesCompleted, codesGuessed: gameStatus.codesGuessed });
});

/*Pressing the PLAY button */
router.get("/play", function(req,res){
  res.sendFile("game.html",{root: "./public"});
});

/*Pressing the RULES button */
router.get("/rules", function(req,res){
  res.sendFile("rules.html",{root: "./public"});
});

module.exports = router;
