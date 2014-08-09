
var projects = [
                { id: 1, name: 'My project 1' },
                { id: 2, name: 'My project 2' }
];

var client = (function() {
    function getMyProjects() {
            return projects;
    }
    
    function getProject(id) {
        for (var k = 0; k < projects.length; k++)
            if (projects[k].id == id)
                return projects[k];
    }

    return {
        getMyProjects: getMyProjects,
        getProject: getProject
    };
})();

if (typeof window == 'undefined')
    module.exports = client;
