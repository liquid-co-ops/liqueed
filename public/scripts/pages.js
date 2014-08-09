
var pages = (function () {
    var active;
    
    function makeButton(text, fnclick) {
        return $("<button>")
            .html(text)
            .attr("type", "button")
            .addClass('btn')
            .addClass('btn-primary')
            .click(fnclick);
    }

    function showProjects(projects) {
        var page = $("#projectspage");
        
        var projs = $("#projects");
        projs.empty();
        
        projects.forEach(function (project) {
            var element = $("<div>").html(makeButton(project.name, function () {
                showProject(project);
            }));
            
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