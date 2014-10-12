
var mongodb = require('mongodb');

function Repository(db, name) {
    function getCollection(callback) {
        db.collection(name, function (err, collection) {
            if (err)
                callback(err);
            else
                callback(null, collection);
        });
    }
    
    this.findAll = function (callback) {
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else {
                collection.find().toArray(function (err, collection) {
                    if (err)
                        callback(err);
                    else
                        callback(null, collection);
                });
            }
        });
    };
    
    this.find = function (query, projection, callback) {
        if (!callback) {
            callback = projection;
            projection = null;
        }
        
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else {
                collection.find(query).toArray(function (err, collection) {
                    if (err)
                        callback(err);
                    else
                        callback(null, collection);
                });
            }
        });
    };
    
    this.insert = function (item, callback) {
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else
                collection.insert(item, callback);
        });
    };
    
    this.update = function (id, item, callback) {
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else
                collection.update({ _id: collection.db.bson_serializer.ObjectID.createFromHexString(id) }, { $set: item }, callback);
        });
    };
    
    this.remove = function (id, callback) {
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else
                collection.remove({ _id: collection.db.bson_serializer.ObjectID.createFromHexString(id) }, callback);
        });
    };
    
    this.findById = function (id, callback) {
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else
                collection.findOne({ _id: collection.db.bson_serializer.ObjectID.createFromHexString(id) }, callback);
        });
    };
    
    this.clear = function (callback) {
        getCollection(function (err, collection) {
            if (err)
                callback(err);
            else
                collection.remove(callback);
        });
    };
};

module.exports = {
    createRepository: function (db, name) { return new Repository(db, name); },
    openDatabase: function (dbname, host, port, username, password, cb) {
        if (!cb)
            cb = function () { };

        var server = new mongodb.Server(host, port, {auto_reconnect: true}, {});
        var db = new mongodb.Db(dbname, server, { safe: true  });

        db.open(function (err, db) {
            if (err) {
                cb(err, null);
                return;
            }
            
            if (username) {
                db.authenticate(username, password, {authdb: "admin"}, function (err, res) {
                    if (err)
                        cb(err, null);
                    else
                        cb(null, db);
                });
            }
            else
                cb(null, db);
        });
        return db;
    }
};

