
var service = require('../services/project');
var sperson = require('../services/person');

function list(req, res) {
    var items = service.getProjects();
    res.send(items);
}

function get(req, res) {
    var id = parseInt(req.params.id);
    var item = service.getProjectById(id);
    
    res.send(item);
}

module.exports = {
    list: list,
    get: get
}

