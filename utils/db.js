'use strict';

var ostore = require('ostore');

var stores = { };

function Store(impl) {
    this.get = function (id) { return impl.get(id); }
    this.find = function (query, projection) { return impl.find(query, projection); }
    this.add = function (data) { return impl.add(data); }
    this.put = function (id, data) { return impl.put(id, data); }
    this.remove = function (id) { return impl.remove(id); }
    this.update = function (id, data) { return impl.update(id, data); }
    this.clear = function () { return impl.clear(); }
}

function getCreateStore(name) {
    if (stores[name])
        return stores[name];
        
    var store = new Store(ostore.createStore());
    stores[name] = store;
    return store;
}

function createStore(name) {
    var store = new Store(ostore.createStore());
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



