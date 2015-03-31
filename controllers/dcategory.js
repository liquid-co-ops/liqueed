'use strict';

var service = require('../services/dcategory');
var async = require('simpleasync');

function getId(id) {
    if (id && id.length && id.length > 10)
        return id;
        
    return parseInt(id);
}

function makeCategory(req) {
    return {
        name: req.param('name')
    }
}

function index(req, res) {
    var projectid = req.params.projectid;
    
    service.getCategoriesByProject(projectid, function (err, items) {
        if (err)
            throw err;
            
        res.render('dcategorylist', { title: 'Decision Categories', items: items, projectid: projectid });
    });
}

function newCategory(req, res) {
    var projectid = req.params.projectid;
    res.render('dcategorynew', { title: 'New Decision Category', projectid: projectid });
}

function addCategory(req, res) {
    var projectid = req.params.projectid;
    var category = makeCategory(req);
    
    service.addCategory(projectid, category, function (err, id) {
        if (!req.params)
            req.params = { };
        req.params.id = id;
        view(req, res);
    });
}

function view(req, res) {
    var projectid = getId(req.params.projectid);
    var id = getId(req.params.id);
    
    var model = {
        title: 'Decision Category'
    };
    
    service.getCategoryById(id, function (err, data) {
        if (err)
            res.render('error', { title: 'Error', error: err });
        else {
            model.item = data;
            res.render('dcategoryview', model);
        }
    });
}

module.exports = {
    index: index,
    newCategory: newCategory,
    addCategory: addCategory,
    view: view
};

