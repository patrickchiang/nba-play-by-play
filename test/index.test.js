const index = require('../index');
require('./test-util');

test("version", () => {
    expect(index.version).toBe("1.0.0");
});

describe('getTeamId', () => {
    let warriorsId = 1610612744;

    test("Warriors", () => {
        expect(index.getTeamId("Warriors")).toBe(warriorsId);
    });

    test("GSW", () => {
        expect(index.getTeamId("GSW")).toBe(warriorsId);
    });

    test("Eagles", () => {
        expect(index.getTeamId("Eagles")).toBe(-1);
    });
});

describe('getAllGames', () => {
    let teamRecordRequest = index.getTeamRecord("Warriors", "2018-19", "Regular+Season");

    test("Not empty", (done) => {
        teamRecordRequest.then(record => {
            expect(record.getAllGames()).toBeTruthy();
            done();
        });
    });

    test("Has first 3 games", (done) => {
        teamRecordRequest.then(record => {
            let games = record.getAllGames();
            expect(games).toHaveProperty("0021800002");
            expect(games).toHaveProperty("0021800024");
            expect(games).toHaveProperty("0021800038");
            done();
        });
    });

    test("Check first game vs OKC", (done) => {
        teamRecordRequest.then(record => {
            let game = record.getAllGames()["0021800002"];
            expect(game).toHaveProperty("GAME_DATE", "OCT 16, 2018");
            expect(game).toHaveProperty("MATCHUP", "GSW vs. OKC");
            expect(game).toHaveProperty("W", 1);
            expect(game).toHaveProperty("Game_ID", "0021800002");
            done();
        });
    });
});

describe('getGame', () => {
    let gameRequest = index.getGame("0021800002");

    test("Not empty", (done) => {
        gameRequest.then(game => {
            expect(game).toBeTruthy();
            done();
        });
    });

    test("Has first quarter start", (done) => {
        let firstQuarterStart = {
            "playTypeId": 12,
            "quarter": 1,
        };

        gameRequest.then(game => {
            expect(game.getPlays()).toContainObject(firstQuarterStart);
            done();
        });
    });

    test("Curry makes shot", (done) => {
        let curryMakesShotInFirstQuarter = {
            "playTypeId": 1,
            "player1": {
                "playerId": 201939,
                "teamId": 1610612744
            }
        };
        gameRequest.then(game => {
            expect(game.getPlays()).toContainObject(curryMakesShotInFirstQuarter);
            done();
        });
    });
});

describe("getPlayerId", () => {
    test("Stephen Curry", () => {
        expect(index.getPlayerId("Stephen", "Curry")).toBe(201939);
    });
    test("Kevon Looney", () => {
        expect(index.getPlayerId("Kevon", "Looney")).toBe(1626172);
    });
    test("Nick Young", () => {
        expect(index.getPlayerId("Nick", "Young")).toBe(201156);
    });
});

test("getAllTeams", () => {
    expect(index.getAllTeams()).toContainObject({teamName: "Warriors"});
    expect(index.getAllTeams()).toContainObject({teamName: "Lakers"});
    expect(index.getAllTeams()).toHaveLength(30);
});

test("getAllPlayers", () => {
    let stephCurry = {
        "playerId": 201939,
        "firstName": "Stephen",
        "lastName": "Curry"
    };
    expect(index.getAllPlayers()).toHaveProperty("201939", stephCurry);
});