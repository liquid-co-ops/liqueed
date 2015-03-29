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

module.exports = {
    addCategory: addCategory,
    getCategoryById: getCategoryById,
    getCategories: getCategories,
    getCategoriesByProject: getCategoriesByProject
};

