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

function clear() {
    for (var n in stores) {        var store = stores[n];
        var ids = store.find(null, { id: true });
        
        ids.forEach(function (id) {
            store.remove(id);
        });
    }
}

module.exports = {

    store: getCreateStore,

    createStore: createStore,
    clear: clear

}



