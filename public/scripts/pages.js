
var pages = (function () {
    var active;
    var me = 1;
    
    function makeProjectButton(text, fnclick) {
        return $("<button>")
            .html(text)
            .attr("type", "button")
            .addClass('btn')
            .addClass('btn-primary')
            .width(200)
            .click(fnclick);
    }

    function makePeriodButton(text, fnclick) {
        return $("<button>")
            .html(text)
            .attr("type", "button")
            .addClass('btn')
            .addClass('btn-success')
            .width(200)
            .click(fnclick);
    }

    function showProjects(projects) {
        var page = $("#projectspage");
        
        var projs = $("#projects");
        projs.empty();
        
        projects.forEach(function (project) {
            var element = $("<div>").html(makeProjectButton(project.name, function () {
                client.getPeriods(project.id, function (err, periods) {
                    if (err)
                        alert(err);
                    else
                        showProject(project, periods);
                });
            }));
            
            projs.append(element);
        });
        
        if (active)
            active.hide();
            
        active = page;
        page.show();
    }
    
    function showProject(project, periods) {
        var page = $("#projectpage");
        
        var projname = $("#projectname");
        
        projname.html(project.name);

        var pers = $("#periods");
        pers.empty();
        
        periods.forEach(function (period) {
            var element = $("<div>").html(makePeriodButton(period.name, function () {
                client.getShareholders(project.id, function (err, shareholders) {
                    if (err)
                        alert(err);
                    else
                        showPeriod(project, period, shareholders);
                });
            }));
            
            pers.append(element);
        });
        
        if (active)
            active.hide();
            
        active = page;
        page.show();
    }

    function showPeriod(project, period, shareholders) {
        var page = $("#periodpage");
        
        var projname = $("#periodprojectname");        
        projname.html(project.name);
        var pername = $("#periodname");        
        pername.html(period.name);
        var amount = $("#periodamount");
        amount.html(period.amount);

        var shares = $("#shares");
        shares.empty();
        
        var inputs = [];
        
        shareholders.forEach(function (shareholder) {
            if (shareholder.id == me)
                return;
            
            var row = $("<tr>");
            row.append($("<td>").html(shareholder.name));
            var input = $("<input>").addClass('form-control').width(50);
            input.shareholder = shareholder;
            inputs.push(input);
            row.append($("<td>").html(input));
            
            shares.append(row);
        });
        
        retval.sharesDone = function () {
            var values = [];
            
            inputs.forEach(function (input) {
                values.push({ 
                    id: input.shareholder.id,
                    name: input.shareholder.name,
                    amount: input.val()
                });
            });
            
            var result = logic.acceptShares(period.amount, values);
            
            if (result === true) {
                alert('Thanks for your input');
                showProject(project, client.getPeriods(project.id));
                return;
            }
                
            alert(result);
        }
        
        if (active)
            active.hide();
            
        active = page;
        page.show();
    }
    
    var retval = {
        showProjects: showProjects
    }
    
    return retval;
})();