'use strict';

var ostore = require('ostore');
var mongodb = require('./mongodb');

var mstores = { };
var dbstores = { };

var db;

var usedb = false;

function DbStore(impl) {
    this.get = function (id, cb) { 
        impl.findById(id, function (err, item) {
            if (item && item._id) {
                item.id = item._id.toString();
                delete item._id;
            }
            cb(err, item);
        });
    };
    
    this.find = function (query, projection, cb) {
        if (!projection && !cb)
            impl.findAll(makeTransform(query));
        else if (!cb)
            impl.find(query, makeTransform(projection));
        else
            impl.find(query, projection, makeTransform(cb));
    };

    this.add = function (data, cb) { 
        impl.insert(data, function (err, item) {
            if (item && item[0] && item[0]._id)
                cb(err, item[0]._id.toString());
            else
                cb(err, null);
        });
    };
    
    this.put = function (id, data, cb) {
        impl.update(id, data, cb);
    };
    
    this.remove = function (id, cb) {
        impl.remove(id, cb);
    };
    
    this.update = function (id, data, cb) {
        impl.update(id, data, cb);
    };
    
    this.clear = function (cb) {
        impl.clear(cb);
    };
}

function makeTransform(cb) {
    return function (err, items) {
        if (items && items.length)
            items.forEach(function (item) {
                if (!item._id)
                    return;
                    
                item.id = item._id.toString();
                delete item._id;
            });
            
        cb(err, items);
    }
}

function MemoryStore(impl) {
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

function getCreateMemoryStore(name) {
    if (mstores[name])
        return mstores[name];
        
    var store = new MemoryStore(ostore.createStore());
    mstores[name] = store;

    return mstores[name];
}

function getCreateDbStore(name) {
    if (dbstores[name])
        return dbstores[name];
        
    var store = new DbStore(mongodb.createRepository(db, name));
    dbstores[name] = store;

    return dbstores[name];
}

function getCreateStore(name) {
    if (usedb)
        return getCreateDbStore(name);
        
    return getCreateMemoryStore(name);
}

function createMemoryStore(name) {
    var store = new MemoryStore(ostore.createStore());
    mstores[name] = store;
    return store;
}

function createDbStore(name) {
    var store = new DbStore(ostore.createStore());
    dbstores[name] = store;
    return store;
}

function createStore(name) {
    if (usedb)
        return createDbStore(name);
        
    return createMemoryStore(name);
}

function clear(cb) {
    var names = Object.keys(mstores);
    
    var l = names.length;
    
    var k = 0;
    
    doStep();
    
    function doStep() {
        if (k >= l) {
            cb(null, null);
            return;
        }
        
        var store = mstores[names[k++]];
        
        store.clear(function (err, data) {
            if (err)
                cb(err, null);
            else
                setImmediate(doStep);
        });
    }
}

function useDb(name, config, cb) {
    config = config || { };
    usedb = true;
    db = mongodb.openDatabase(name, config.host || 'localhost', config.port || 27017, cb);
}

function closeDb(cb) {
    db.close(cb);
}

function useMemory() {
    usedb = false;
    db.close();
}

module.exports = {
    store: getCreateStore,

    createStore: createStore,
    clear: clear,
    
    useDb: useDb,
    closeDb: closeDb
};



