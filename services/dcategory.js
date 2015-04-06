'use strict';

var db = require('../utils/db');

var store;

db.store('dcategories', function (err, data) {
    store = data;
});

function addCategory(projid, data, cb) {
    var newdata = { };
    
    for (var n in data)
        newdata[n] = data[n];
        
    newdata.project = projid;
    
    var store = db.store('dcategories');
        
    store.add(newdata, cb);
}

function getCategoryById(id, cb) {
    var store = db.store('dcategories');
    store.get(id, cb);
}

function getCategories(cb) {
    var store = db.store('dcategories');
    store.find(cb);
}

function getCategoriesByProject(projectid, cb) {
    var store = db.store('dcategories');
    store.find({ project: projectid }, cb);
}

function getCategoryByProjectAndName(projectid, name, cb) {
    var store = db.store('dcategories');
    store.find({ project: projectid, name: name }, function (err, items) {
        if (err)
            cb(err, null);
        else if (items && items.length)
            cb(null, items[0]);
        else
            cb(null, null);
    });
}

module.exports = {
    addCategory: addCategory,
    getCategoryById: getCategoryById,
    getCategoryByProjectAndName: getCategoryByProjectAndName,
    getCategories: getCategories,
    getCategoriesByProject: getCategoriesByProject
};

