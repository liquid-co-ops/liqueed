'use strict';

var ostore = require('ostore');

var stores = { };

function getCreateStore(name) {
    if (stores[name])
        return stores[name];
        
    var store = ostore.createStore();
    stores[name] = store;
    return store;
}

function createStore(name) {
    var store = ostore.createStore();
    stores[name] = store;
    return store;
}

function clear() {
    for (var n in stores) {
        var store = stores[n];
        store.clear();
    }
}

module.exports = {

    store: getCreateStore,

    createStore: createStore,
    clear: clear

};



