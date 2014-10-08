
var sl;

if (typeof sl == 'undefined')
    sl = require('simplelists');

var projects = [
    { id: 1, name: 'My project 1',
        periods: [
            { id: 1, name: 'January 2014', amount: 100, "date": "2014-01-31" },
            { id: 2, name: 'February 2014', amount: 100, "date": "2014-02-28" },
            { id: 3, name: 'March 2014', amount: 100, "date": "2014-03-31" }
        ],
        shareholders: [
            { id: 1, name: 'Alan', username: 'alan' },
            { id: 2, name: 'Fabricio', username: 'fabricio' },
            { id: 3, name: 'Nicolas', username: 'nicolas' },
            { id: 4, name: 'Maximo', username: 'maximo' },
            { id: 5, name: 'Angel', username: 'ajlopez' },
            { id: 6, name: 'Sebastian Streiger', username: 'sebastian' },
            { id: 7, name: 'Laura Fraile', username: 'laura' }
        ]
    },
    { id: 2, name: 'My project 2'
    }
];

var maxprojid = 2;

var clientlocal = (function() {
    function getPersons(cb) {
        var result = [];
        
        projects[0].shareholders.forEach(function (item) {
            result.push(item);
        });
        
        cb(null, sl.sort(result, 'name'));
    }
    
    function getMyProjects(cb) {
        cb(null, sl.sort(projects, 'name'));
    }
    
    function addProject(project, cb) {
        project.id = ++maxprojid;
        projects.push(project);
        
        cb(null, project.id);
    }
    
    function getProject(idproj, cb) {
        for (var k = 0; k < projects.length; k++)
            if (projects[k].id == idproj) {
                cb(null, projects[k]);
                return;
            }
            
        cb(null, null);
    }
    
    function getViaCallback(objectName, cb){
        return function (err, project) {
            var object = project[objectName];
            if (!object)
                cb(null, []);
            else
                cb(null, object);
        }
    }

    function getPeriods(idproj, cb) {
        getProject(idproj, getViaCallback("periods", cb));
    }
    
    function getShareholders(idproj, cb) {
        getProject(idproj, getViaCallback("shareholders", cb));
    }

    return {
        getMyProjects: getMyProjects,
        getProject: getProject,
        addProject: addProject,
        getPeriods: getPeriods,
        getShareholders: getShareholders,
        getPersons: getPersons
    };
})();

if (typeof window == 'undefined')
    module.exports = clientlocal;
