'use strict';

var db = require('../utils/db');

var store;

db.store('dcategories', function (err, data) {
    store = data;
});

function addCategory(data, cb) {
    var store = db.store('dcategories');
        
    store.add(data, cb);
}

function getCategoryById(id, cb) {
    var store = db.store('dcategories');
    store.get(id, cb);
}

function getCategories(cb) {
    var store = db.store('dcategories');
    store.find(cb);
}

module.exports = {
    addCategory: addCategory,
    getCategoryById: getCategoryById,
    getCategories: getCategories
};

