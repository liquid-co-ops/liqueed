'use strict';

var service = require('../services/dcategory');
var async = require('simpleasync');

function index(req, res) {
    console.dir(req.params);
    var projectid = req.params.projectid;
    
    service.getCategoriesByProject(projectid, function (err, items) {
        if (err)
            throw err;
            
        console.log('projectid', projectid);
            
        res.render('dcategorylist', { title: 'Decision Categories', items: items, projectid: projectid });
    });
}

function newCategory(req, res) {
    var projectid = req.params.projectid;
    
    service.getCategoriesByProject(projectid, function (err, items) {
        if (err)
            throw err;
            
        res.render('dcategorynew', { title: 'New Decision Category', projectid: projectid });
    });
}

module.exports = {
    index: index,
    newCategory: newCategory
};

