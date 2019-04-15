const index = require('../index');

let gameRequest = index.getGame("0021800002");

describe("filterByType", () => {
    test("Scoring plays", (done) => {
        gameRequest.then(game => {
            expect(game.filterByType(1).getPlays()).toHaveLength(75);
            done();
        });
    });

    test("Missed plays", (done) => {
        gameRequest.then(game => {
            expect(game.filterByType(2).getPlays()).toHaveLength(111);
            done();
        });
    });

    test("Turnovers", (done) => {
        gameRequest.then(game => {
            expect(game.filterByType(5).getPlays()).toHaveLength(36);
            done();
        });
    });

});

describe("filterByPlayer", () => {
    const curryPlayerId = 201939;

    test("Curry plays", (done) => {
        gameRequest.then(game => {
            expect(game.filterByPlayer(curryPlayerId).getPlays()).toHaveLength(42);
            done();
        });
    });

    test("Curry plays (including as secondary player)", (done) => {
        gameRequest.then(game => {
            expect(game.filterByPlayer(curryPlayerId, true).getPlays()).toHaveLength(58);
            done();
        });
    });

    test("Curry 3 pointer attempts", (done) => {
        gameRequest.then(game => {
            let curryPlays = game.filterByPlayer(curryPlayerId).getPlays();
            let curryThrees = curryPlays.filter(play => {
                return play.threePointer;
            });
            expect(curryThrees).toHaveLength(9);
            done();
        });
    });
});