/**
 * Statistics stored, expandable
 */
const gameStatus = {
    since: Date.now(),
    gamesInitialized: 0,
    gamesAborted: 0,
    gamesCompleted: 0,
    codesGuessed: 0
};

module.exports = gameStatus;