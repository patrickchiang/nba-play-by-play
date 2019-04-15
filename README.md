# NBA Play-by-Play JS Lightweight API

A simple, lightweight utility API to grab NBA play-by-play data to facilitate gathering data not reflected in boxscores.

## Installation

```
npm install --save nba-play-by-play
```

## Usage

```
const playByPlay = require('nba-play-by-play');
```

#### Getting teamId:

```
console.log(playByPlay.getTeamId("Warriors"));
console.log(playByPlay.getTeamId("GSW"));
```

#### Getting all game records for a team:

This returns a Promise that will resolves to a TeamRecord object containing game entries for a team's season(s).

```
let teamRecordRequest = playByPlay.getTeamRecord("Warriors", "2018-19", "Regular+Season");
teamRecordRequest.then(record => {
    // record is a TeamRecord object
});
```

#### TeamRecord

A TeamRecord contains the methods:
- `getAllGames()`
- `getGameIdList()`

Calling `getAllGames()` returns a singular object containing game summary information keyed to gameIds:
```
{
    "0021800002": {
        // game data
    },
    "0021800024": {},
    "0021800038": {},
    "0021800047": {}, 
    ...etc
}
```

Game summary entry format:

```
"0021800002": {
    "AST": 28,
    "BLK": 7,
    "DREB": 41,
    "FG3A": 26,
    "FG3M": 7,
    "FG3_PCT": 0.269,
    "FGA": 95,
    "FGM": 42,
    "FG_PCT": 0.442,
    "FTA": 18,
    "FTM": 17,
    "FT_PCT": 0.944,
    "GAME_DATE": "OCT 16, 2018",
    "Game_ID": "0021800002",
    "L": 0,
    "MATCHUP": "GSW vs. OKC",
    "MIN": 240,
    "OREB": 17,
    "PF": 29,
    "PTS": 108,
    "REB": 58,
    "STL": 7,
    "TOV": 21,
    "Team_ID": 1610612744,
    "W": 1,
    "WL": "W",
    "W_PCT": 1
}
```

Calling `getGameIdList()` returns an array of gameId strings:

```
[
    "0021801225",
    "0021801215",
    "0021801205",
    ...
]
```

These gameIds are used for querying for play by play data.

#### Get play-by-play for a game

This returns a Promise that will resolves to a Game object containing play-by-play entries for the game.

```
let gameRequest = index.getGame("0021800002");
gameRequest.then(game => {
    // process Game object
});
```

#### Game

A Game contains the methods:
- `getPlays()` Returns all plays in the Game object in an array.
- `filterByType(typeId)` Returns a new Game object containing only plays of specified type.
- `filterByPlayer(playerId, showAllRelated)` Returns a new Game object containing only plays related to specified player. Passing true for showAllRelated will also include plays in which the player is involved as a secondary player (ie assisting a scorer).

Plays have the following format:

```
{
    "actionId": 80,
    "description": "Curry 24' 3PT Step Back Jump Shot (3 PTS) (Durant 1 AST)",
    "distance": "24",
    "gameId": "0021800002",
    "margin": "3",
    "playId": 10,
    "playTypeId": 1,
    "player1": {
    "playerId": 201939,
    "teamId": 1610612744
    },
    "player2": {
    "playerId": 201142,
    "teamId": 1610612744
    },
    "quarter": 1,
    "realTime": "10:57 PM",
    "score": "0 - 3",
    "threePointer": true,
    "timeInQuarter": "11:31"
}
```

Play types:

| typeId  | Play     |
|----|---------------|
| 1  | field goal    |
| 2  | missed shot   |
| 3  | free throw    |
| 4  | rebound       |
| 5  | turnover      |
| 6  | foul          |
| 7  | ???           |
| 8  | substitution  |
| 9  | timeout       |
| 10 | jumpball      |
| 11 | ejection      |
| 12 | start quarter |
| 13 | end quarter   |

#### Player IDs

This gets the player id of a player using their first and last name. Must be exact match.

```
const steph = playByPlay.getPlayerId("Stephen", "Curry")
```

You can play around with the underlying raw team and player data with the functions:

```
playByPlay.getAllTeams()
playByPlay.getAllPlayers()
```

A player looks like:

```
"201939": {
    "playerId": 201939,
    "firstName": "Stephen",
    "lastName": "Curry"
}
```

A team looks like:

```
{
    "teamId": 1610612738,
    "code": "BOS",
    "teamName": "Celtics",
    "prefix": "Boston"
}
```

For usage examples, unit tests are included in `/tests`.