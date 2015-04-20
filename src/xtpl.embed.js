(function(app){

    window.x_templating = app;

}(

    (function($, DomReady, EventMessageHandler){

        var TEMPLATE_STORE = {},
            scripts = document.getElementsByTagName("script"),
            src = null;

        // get the embed script source path
        // to determine the domain to use
        for (var i = 0; i < scripts.length; i++) {
            var attr = scripts[i].getAttribute("src") || "";
            if (attr.indexOf("/xtpl.embed.js") > -1) {
                src = attr;
                break;
            }
        }

        if (!src) { return false; }

        var path = src.replace("/xtpl.embed.js", "/assets"),
            ifrId = "x-templating-ifr",
            ifrSrc = path +  "/frame.html";

        // embed iframe
        // use jQuery if it's available
        if ($) {
            $(document).ready(function(){
                $("body").append('<iframe id="'+ifrId+'" src="'+ifrSrc+'" frameborder="0" width="1" height="1" style="display: none !important; width: 1px; height: 1px;" ></iframe>');
            });
        } else {
            DomReady(function(){
                var ifr = document.createElement("iframe");
                ifr.setAttribute("id", ifrId);
                ifr.setAttribute("src", ifrSrc);
                ifr.frameborder = 0;
                ifr.style.display = "none";
                ifr.style.width = "1px";
                ifr.style.height = "1px";
                (document.getElementsByTagName("body"))[0].appendChild(ifr);
            });
        }

        var OnReady = function(execFN) {
            if ($) {
                $(document).ready(function(){
                    execFN();
                });
            } else {
                DomReady(function(){
                    execFN();
                });
            }
        };

        var bindEvent = function(target, event, fn) {
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

                    if ($) {
                        $(iframe).bind("load", function(){
                            trigger();
                        });
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
        window.jQuery || null,

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