(function(app){

    window.x_templating = app;

}(

    (function(DomReady, EventMessageHandler){

        var TEMPLATE_STORE = {},
            FRAME_LOADED = false,
            scripts = document.getElementsByTagName("script"),
            src = null;

        // get the embed script source path
        // to determine the domain to use
        for (var i = 0; i < scripts.length; i++) {
            var attr = scripts[i].getAttribute("src") || "";
            if (attr.indexOf("/xtpl.embed.min.js") > -1) {
                src = attr;
                break;
            }
        }

        if (!src) { return false; }

        var path = src.replace("/xtpl.embed.min.js", "/assets"),
            ifrId = "x-templating-ifr",
            ifrSrc = path +  "/frame.html";

        // embed iframe
        // use jQuery if it's available
        DomReady(function(){
            var ifr = document.createElement("iframe");

            bindEvent(iframe, "load", function() {
                trigger();
            });

            ifr.setAttribute("id", ifrId);
            ifr.setAttribute("src", ifrSrc);
            ifr.frameborder = 0;
            ifr.style.display = "none";
            ifr.style.width = "1px";
            ifr.style.height = "1px";
            (document.getElementsByTagName("body"))[0].appendChild(ifr);
        });

        function OnReady(execFN) {
            DomReady(function(){
                execFN();
            });
        };

        function bindEvent(target, event, fn) {
            if (target.addEventListener) {
                target.addEventListener(event, fn, false);
            } else if (target.attachEvent) {
                target.attachEvent("on" + event, fn);
            }
        };

        var App = function() {

            this.VERSION = "${version}";
        };

        /**
         * @function get
         *
         * @description
         * load template
         *
         * @param  {String}   template  template path
         * @param  {Function} callback  callback funciton
         */
        App.prototype.get = function(template, callback) {
            OnReady(function(){

                var eventId = "get.template",
                    tplId = [eventId, template].join("_"),
                    iframe = document.getElementById(ifrId);

                // stored template
                if (TEMPLATE_STORE[tplId]) {

                    callback(TEMPLATE_STORE[tplId].markup);

                } else {

                    EventMessageHandler.addHandler(tplId, function(data){
                        TEMPLATE_STORE[tplId] = data;
                        callback(data.markup);
                    });

                    var trigger = function() {
                        EventMessageHandler.sendMessage(iframe, eventId, { id: tplId, template: template });
                    };

                    if (FRAME_LOADED) {
                        trigger();
                    } else {
                        bindEvent(iframe, "load", function() {
                            trigger();
                        });
                    }

                }

            });
        };

        return (new App());

    }(

        (function(){
            //inclue:domready
            return domready;
        }()),

        (function(){
            //inclue:messenger
            return (new EventMessageHandler());
        }())

    ))

));