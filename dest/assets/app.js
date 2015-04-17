var Templating = (function($){

    var CONST = {};

    CONST.path = "/static/v/all/js/apps/templates/tpl/";
    CONST.prefix = "FOX_TPL_";
    CONST.fileSuffix = ".html";

    var App = function() {

        var self = this,
            Events = self._events = new EventMessageHandler();

        self._vars = {};
        var vars = self._vars;

        // listener
        Events.addHandler("Templating.Embed", function(data){

            vars._data = data;
            self.init();

        });

    };

    App.prototype.init = function() {
        var self = this,
            vars = self._vars,
            template = vars._data.template;

        if (!template) { return false; }

        self.get(template);

    };

    App.prototype.send = function(template, data) {
        var self = this,
            Events = self._events,
            id = generateId(template);

        Events.sendMessage("parent", id, data);
    };

    App.prototype.get = function(template) {
        var self = this,
            vars = self._vars,
            data = vars._data,
            path = (data && data.config && data.config.path) ? data.config.path : CONST.path,
            suffix = (data && data.config && data.config.fileSuffix) ? data.config.fileSuffix : CONST.fileSuffix,
            url = ([path, template].join("/").replace(/\/+/g, "/")) + suffix;

        $.ajax({
            url: url,
            dataType: "text",
            success: function(data) {
                if (data) { self.send(template, data); }
            }
        });

    };

    var generateId = function(val) {
        val = val.replace(/[^A-Za-z\-\_]/gi, "-");
        return (CONST.prefix + val);
    };

    // Get Query Parameters
    var getQuery = function(param) {
        var x, val = false, query = window.location.search.substr(1), qArr = query.split("&"), len = qArr.length;
        for (x = 0; x < len; x++) {
            var pair = qArr[x].split("=");
            if (pair[0]===param) { val = (decodeURIComponent(pair[1])).toString(); break; } // "" to make sure to return a string
        }
        return val;
    };

    return App;

}(jQuery));