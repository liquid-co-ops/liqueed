'use strict';

var ostore = require('ostore');
var mongodb = require('./mongodb');

var mstores = { };
var dbstores = { };

var db;

var usedb = false;

function DbStore(impl) {
    this.get = function (id, cb) { 
        try {
            impl.findById(id, function (err, item) {
                if (item && item._id) {
                    item.id = item._id.toString();
                    delete item._id;
                }
                cb(err, item);
            });
        }
        catch (err) {
            cb(err, null);
        }
    };
    
    this.find = function (query, projection, cb) {
        try {
            if (!projection && !cb)
                impl.findAll(makeTransform(query));
            else if (!cb)
                impl.find(query, makeTransform(projection));
            else
                impl.find(query, projection, makeTransform(cb));
        }
        catch (err) {
            cb(err, null);
        }
    };

    this.add = function (data, cb) { 
        try {
            impl.insert(data, function (err, item) {
                if (item && item[0] && item[0]._id)
                    cb(err, item[0]._id.toString());
                else
                    cb(err, null);
            });
        }
        catch (err) {
            cb(err, null);
        }
    };
    
    this.put = function (id, data, cb) {
        try {
            impl.update(id, data, cb);
        }
        catch (err) {
            cb(err, null);
        }
    };
    
    this.remove = function (id, cb) {
        try {
            impl.remove(id, cb);
        }
        catch (err) {
            cb(err, null);
        }
    };
    
    this.update = function (id, data, cb) {
        try {
            impl.update(id, data, cb);
        }
        catch (err) {
            cb(err, null);
        }
    };
    
    this.clear = function (cb) {
        try {
            impl.clear(cb);
        }
        catch (err) {
            cb(err, null);
        }
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

function clearStores(stores, cb) {
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

function clear(cb) {
    if (usedb)
        clearStores(dbstores, cb);
    else
        clearStores(mstores, cb);
}

function useDb(name, config, cb) {
    config = config || { };
    usedb = true;
    dbstores = { };
    db = mongodb.openDatabase(name, config.host || 'localhost', config.port || 27017, config.username, config.password, cb);
    getCreateStore('persons');
    getCreateStore('projects');
    getCreateStore('teams');
    getCreateStore('assignments');
    getCreateStore('notes');
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

