'use strict';

var service = require('../services/decision');
var dcservice = require('../services/dcategory');
var async = require('simpleasync');

function index(req, res) {
    var projectid = req.params.projectid;
    
    service.getDecisionsByProject(projectid, function (err, items) {
        if (err)
            throw err;
            
        res.render('decisionlist', { title: 'Decisions', items: items, projectid: projectid });
    });
}

function newDecision(req, res) {
    var projectid = req.params.projectid;
    
    dcservice.getCategoriesByProject(projectid, function (err, items) {
        if (err)
            throw err;
            
        res.render('decisionnew', { title: 'New Decision', projectid: projectid, categories: items });
    });
}

module.exports = {
    index: index,
    newDecision: newDecision
};

