
var service = require('../services/person');

function index(req, res) {
    var items = service.getPersons();
    res.render('personlist', { title: 'People', items: items });
};

function view(req, res) {
    var item = service.getPersonById(req.params.id);
    res.render('personview', { title: 'Person', item: item });
};

module.exports = {
    index: index,
    view: view
};