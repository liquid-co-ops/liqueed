'use strict';
var ostore = require('ostore');

var stores = { }

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

module.exports = {
    store: getCreateStore,
    createStore: createStore
}

