
var projects = [
    { id: 1, name: 'My project 1',
        periods: [
            { id: 1, name: 'January 2014', amount: 100 },
            { id: 2, name: 'February 2014', amount: 100 },
            { id: 3, name: 'March 2014', amount: 100 }
        ],
        shareholders: [
            { id: 1, name: 'Alan' },
            { id: 2, name: 'Fabricio' },
            { id: 3, name: 'Nicolas' },
            { id: 4, name: 'Maximo' },
            { id: 5, name: 'Angel' }
        ]
    },
    { id: 2, name: 'My project 2'
    }
];

var client = (function() {
    function getMyProjects(cb) {
        cb(null, projects);
    }
    
    function getProject(idproj, cb) {
        for (var k = 0; k < projects.length; k++)
            if (projects[k].id == idproj) {
                cb(null, projects[k]);
                return;
            }
            
        cb(null, null);
    }
    
    function getPeriods(idproj, cb) {
        getProject(idproj, function (err, project) {
            var periods = project.periods;
            if (!periods)
                cb(null, []);
            else
                cb(null, periods);
        });        
    }
    
    function getShareholders(idproj, cb) {
        getProject(idproj, function (err, project) {
            var shareholders = project.shareholders;
        
            if (!shareholders)
                cb(null, []);
            else
                cb(null, shareholders);
        });
    }

    return {
        getMyProjects: getMyProjects,
        getProject: getProject,
        getPeriods: getPeriods,
        getShareholders: getShareholders
    };
})();

if (typeof window == 'undefined')
    module.exports = client;
