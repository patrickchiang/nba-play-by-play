const index = require('../index');

let teamRecordRequest = index.getTeamRecord("Warriors", "2018-19", "Regular+Season");

test("getGameIdList", (done) => {
    teamRecordRequest.then(record => {
        expect(record.getGameIdList()).toBeTruthy();
        expect(record.getGameIdList()).toHaveLength(82);
        done();
    });
});