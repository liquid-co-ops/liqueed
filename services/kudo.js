
var db = require('../utils/db');
var sl = require('simplelists');
var store;

function getReceivedKudos(personid, cb) {
    var store = db.store('kudos');
    
    store.find({ to: personid }, function (err, data) {
        if (err) {
            cb(err, null);
            return;
        }
        
        cb(null, sl.sum(data, 'count'));
    });
}

function getSentKudoList(personid, cb) {
    var store = db.store('kudos');
    
    store.find({ from: personid }, cb);
}

function sendKudo(fromid, toid, cb) {
    var store = db.store('kudos');
    
    var data = {
        from: fromid,
        to: toid,
        count: 1,
        created: new Date()
    }
    
    store.add(data, cb);
}

module.exports = {
    getSentKudoList: getSentKudoList,
    getReceivedKudos: getReceivedKudos,
    sendKudo: sendKudo
}
