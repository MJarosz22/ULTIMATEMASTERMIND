# ULTIMATEMASTERMIND
This project is a famous multiplayer board game, mastermind.

### Prerequisites
In order to run this project, you will need to have node.js and express.js installed as well as a modern browser.

### Starting the game
After running the app.js file with selected port as argument, you can play the game locally on specified port. The app is not deployed anywhere.
To play the game, it has to be opened in two different browser windows. One of the player chooses the code for the other to guess.

### Features
* multiple games can be played simultanously
* when one of the players leaves, the other is notified
* some of the statistics are tracked and re-rendered whenever they are updated
* if player's browser window is too small, they get notified (CSS media queries)

### Built With
* HTML/CSS - layout/frontend of the game (both splash and game screen)
* JavaScript (ES5) - frontend and game logic
* Node.js with Express.js - backend of the game. Players communicate with the server using websockets.
* EJS - tracking stats and rendering them whenever they are updated

### Authors 
@jialson / @mjarosz22
<br>
@tommyhu234
