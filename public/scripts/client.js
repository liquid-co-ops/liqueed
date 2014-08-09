
var client = (function() {
    return {
        getMyProjects: function () {
            return [
                { id: 1, name: 'My project 1' },
                { id: 2, name: 'My project 2' }
            ];
        }
    };
})();

if (typeof window == 'undefined')
    module.exports = client;
