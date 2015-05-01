
var kudos = { };

function getReceivedKudos(personid, cb) {
    var kudo = 0;
    if (kudos[personid])
        kudo = kudos[personid];
    cb(null, kudo);
}

function sendKudo(fromid, toid, cb) {
    if (!kudos[toid])
        kudos[toid] = 0;
    kudos[toid]++;
    cb(null, null);
}

module.exports = {
    getReceivedKudos: getReceivedKudos,
    sendKudo: sendKudo
}