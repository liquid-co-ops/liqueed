
var projects = [
    { id: 1, name: 'My project 1',
        periods: [
            { id: 1, name: 'January 2014' },
            { id: 2, name: 'February 2014' },
            { id: 3, name: 'March 2014' }
        ]
    },
    { id: 2, name: 'My project 2'
    }
];

var client = (function() {
    function getMyProjects() {
            return projects;
    }
    
    function getProject(idproj) {
        for (var k = 0; k < projects.length; k++)
            if (projects[k].id == idproj)
                return projects[k];
    }
    
    function getPeriods(idproj) {
        return getProject(idproj).periods;
    }

    return {
        getMyProjects: getMyProjects,
        getProject: getProject,
        getPeriods: getPeriods
    };
})();

if (typeof window == 'undefined')
    module.exports = client;
