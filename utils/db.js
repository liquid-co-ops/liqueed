'use strict';

var ostore = require('ostore');

var stores = { };

function Store(impl) {
    this.get = function (id, cb) { 
        setImmediate(function () {
            cb(null, impl.get(id)); 
        });
    };
    
    this.find = function (query, projection, cb) {
        if (!cb) {
            if (projection) {
                cb = projection;
                projection = null;
            }
            else {
                cb = query;
                query = null;
                projection = null;
            }
        }
        
        setImmediate(function() {
            cb(null, impl.find(query, projection));
        });
    };

    this.add = function (data, cb) { 
        setImmediate(function () {
            cb(null, impl.add(data));
        });
    };
    
    this.put = function (id, data, cb) {
        setImmediate(function () {
            cb(null, impl.put(id, data));
        });
    };
    
    this.remove = function (id, cb) {
        setImmediate(function () {
            cb(null, impl.remove(id)); 
        });
    };
    
    this.update = function (id, data, cb) {
        setImmediate(function () { 
            cb(null, impl.update(id, data)); 
        });
    };
    
    this.clear = function (cb) {
        setImmediate(function () {
            cb(null, impl.clear());
        });
    };
}

function getCreateStore(name, cb) {
    if (stores[name]) {
        cb(null, stores[name]);
        return;
    }
        
    var store = new Store(ostore.createStore());
    stores[name] = store;
    
    cb(null, store);
}

function createStore(name, cb) {
    var store = new Store(ostore.createStore());
    stores[name] = store;
    
    cb(null, store);
}

function clear(cb) {
    var names = Object.keys(stores);
    
    var l = names.length;
    
    var k = 0;
    
    doStep();
    
    function doStep() {
        if (k >= l) {
            cb(null, null);
            return;
        }
        
        var store = stores[names[k++]];
        
        store.clear(function (err, data) {
            if (err)
                cb(err, null);
            else
                setImmediate(doStep);
        });
    }
}

module.exports = {
    store: getCreateStore,

    createStore: createStore,
    clear: clear
};



