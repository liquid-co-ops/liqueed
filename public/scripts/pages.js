
var pages = (function () {
    var active;

    function showProjects(projects) {
        var page = $("#projectspage");
        
        var projs = $("#projects");
        projects.forEach(function (project) {
            var element = $("<div>").html(project.name).click(function () {
                showProject(project);
            });
            projs.append(element);
        });
        
        if (active)
            active.hide();
            
        active = page;
        page.show();
    }
    
    function showProject(project) {
        var page = $("#projectpage");
        
        var projname = $("#projectname");
        
        projname.html(project.name);
        
        if (active)
            active.hide();
            
        active = page;
        page.show();
    }
    
    return {
        showProjects: showProjects
    }
})();