const request = require('request');

const packageJson = require('./package.json');
const teams = require('./data/teams.json');
const players = require('./data/players.json');

const Game = require('./src/Game');
const TeamRecord = require('./src/TeamRecord');

exports.version = packageJson.version;

// input allowed: team name, team code, team id (for wrapping)
function getTeamId(input) {
    let teamId = -1;
    teams.forEach(team => {
        if (team.teamName === input || team.code === input || team.teamId === input) {
            teamId = team.teamId;
        }
    });

    return teamId;
}

exports.getTeamId = getTeamId;

const httpHeaders = {
    "Accept-Language": "en-US",
    "Accept": "*/*",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36",
    "Referer": "http://stats.nba.com/scores/",
    "Connection": "keep-alive",
    "Cache-Control": "no-cache",
    "Origin": "http://stats.nba.com",
};

// Season: 2018-19 etc, ALL
// Season Type: "Regular+Season", "Playoffs", "All+Star", "Pre+Season"
exports.getTeamRecord = (team, season, seasonType) => {
    return new Promise((resolve, reject) => {
        let requestOptions = {
            url: `https://stats.nba.com/stats/teamgamelog?Season=${season}&SeasonType=${seasonType}&TeamID=${getTeamId(team)}`,
            headers: httpHeaders,
            gzip: true
        };

        request(requestOptions,
            (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    let responseJson = JSON.parse(body);
                    let games = {};

                    let headers = responseJson.resultSets[0].headers;
                    let rows = responseJson.resultSets[0].rowSet;
                    rows.forEach(row => {
                        games[row[1]] = {};

                        headers.forEach((header, index) => {
                            games[row[1]][header] = row[index];
                        });
                    });

                    resolve(new TeamRecord(games));
                }
            });
    });
};

// Start and end quarters optional. Leave null if getting plays for full game.
exports.getGame = (gameId, startQuarter, endQuarter) => {
    let startPeriod = startQuarter || 0;
    let endPeriod = endQuarter || 14;

    return new Promise((resolve, reject) => {
        let requestOptions = {
            url: `https://stats.nba.com/stats/playbyplayv2?gameId=${gameId}&startPeriod=${startPeriod}&endPeriod=${endPeriod}`,
            headers: httpHeaders,
            gzip: true
        };

        request(requestOptions,
            (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    let responseJson = JSON.parse(body);

                    let plays = [];

                    let rows = responseJson.resultSets[0].rowSet;

                    let runningScore = "0 - 0";
                    let runningMargin = 0;
                    rows.forEach(row => {
                        let play = handlePlay(row);

                        if (play.score) {
                            runningScore = play.score;
                        } else {
                            play.score = runningScore;
                        }
                        if (play.margin) {
                            runningMargin = play.margin;
                        } else {
                            play.margin = runningMargin;
                        }

                        plays.push(play);
                    });

                    resolve(new Game(plays));
                }
            });
    });
};

function handlePlay(row) {
    let play = {};
    play.gameId = row[0];
    play.playId = row[1];
    play.playTypeId = row[2];
    play.actionId = row[3]; // ???
    play.quarter = row[4];
    play.realTime = row[5];
    play.timeInQuarter = row[6];

    if (row[7] && !row[9]) {
        play.description = row[7];
    } else if (row[9] && !row[7]) {
        play.description = row[9];
    } else if (row[7] && row[9]) {
        play.description = row[7] + " | " + row[9];
    } else {
        play.description = row[8];
    }

    if (play.description) {
        let distanceMatch = play.description.match(/[0-9]*'/g);
        if (distanceMatch && distanceMatch.length > 0)
            play.distance = distanceMatch[0].replace("'", "");

        let threeMatch = play.description.match(/3PT/g);
        if (threeMatch && threeMatch.length > 0)
            play.threePointer = true;

    }

    play.score = row[10];
    play.margin = row[11];

    if (isValidPlayerType(row[12])) {
        play.player1 = {};
        play.player1.playerId = row[13];
        play.player1.teamId = row[15];
    }

    if (isValidPlayerType(row[19])) {
        play.player2 = {};
        play.player2.playerId = row[20];
        play.player2.teamId = row[22];
    }

    if (isValidPlayerType(row[26])) {
        play.player3 = {};
        play.player3.playerId = row[27];
        play.player3.teamId = row[29];
    }

    return play;
}

function isValidPlayerType(type) {
    return type === 4 || type === 5;
}

exports.getPlayerId = (firstName, lastName) => {
    return Object.values(players).find((player) => {
        return player.firstName === firstName && player.lastName === lastName;
    }).playerId;
};

exports.getAllTeams = () => {
    return teams;
};

exports.getAllPlayers = () => {
    return players;
};