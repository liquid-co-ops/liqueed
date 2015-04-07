'use strict';

var service = require('../services/decision');
var dcservice = require('../services/dcategory');
var async = require('simpleasync');

function getId(id) {
    if (id && id.length && id.length > 10)
        return id;
        
    return parseInt(id);
}

function makeDecision(req) {
    return {
        description: req.param('description'),
        category: getId(req.param('category'))
    }
}

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

function addDecision(req, res) {
    var projectid = req.params.projectid;
    var decision = makeDecision(req);
    
    service.addDecision(projectid, decision, function (err, id) {
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
        title: 'Decision',
        projectid: projectid
    };
    
    service.getDecisionById(id, function (err, data) {
        if (err)
            res.render('error', { title: 'Error', error: err });
        else {
            model.item = data;
            
            dcservice.getCategoryById(data.category, function (err, category) {
                if (err)
                    res.render('error', { title: 'Error', error: err });
                else {
                    if (category)
                        model.categoryname = category.name;
                    else
                        model.categoryname = data.category;
                        
                    res.render('decisionview', model);
                }
            });
        }
    });
}

module.exports = {
    index: index,
    newDecision: newDecision,
    addDecision: addDecision,
    view: view
};

