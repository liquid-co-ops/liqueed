
function showProjects(projects) {
    var projs = $("#projects");
    projects.forEach(function (project) {
        projs.append($("<div>").html(project.name));
    });
}