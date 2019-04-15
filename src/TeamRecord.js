const internal = {};

module.exports = internal.TeamRecord = class {
    constructor(games) {
        this.games = games;
    }

    getAllGames() {
        return this.games;
    }

    getGameIdList() {
        let gameIdList = [];
        for (let gameId in this.games) {
            if(!this.games.hasOwnProperty(gameId)) continue;
            gameIdList.push(gameId);
        }
        return gameIdList;
    }
};