const internal = {};

module.exports = internal.Game = class {
    constructor(plays) {
        this.plays = plays;
    }

    getPlays() {
        return this.plays;
    }

    /*
        Play type list:
        1 field goal
        2 missed shot
        3 free throw
        4 rebound
        5 turnover
        6 foul
        8 substitution
        9 timeout
        10 jump ball
        11 ejection
        12 start quarter
        13 end quarter
    */
    filterByType(typeId) {
        let filter = this.plays.filter(play => {
            return typeId === play.playTypeId
        });
        return new internal.Game(filter);
    }

    filterByPlayer(playerId, showAllRelated) {
        let filter = this.plays.filter(play => {
            return showAllRelated ?
                // allow secondary players
                play.player1 && playerId === play.player1.playerId ||
                play.player2 && playerId === play.player2.playerId ||
                play.player3 && playerId === play.player3.playerId :
                // main player only
                play.player1 && playerId === play.player1.playerId
        });
        return new internal.Game(filter);
    }
};