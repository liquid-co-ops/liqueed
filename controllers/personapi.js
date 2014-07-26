'use strict';

var service = require('../services/person');

function list(req, res) {
    var items = service.getPersons();
    res.send(items);
};

function get(req, res) {
    var item = service.getPersonById(req.params.id);
    res.send(item);
};

module.exports = {
    list: list,
    get: get
};